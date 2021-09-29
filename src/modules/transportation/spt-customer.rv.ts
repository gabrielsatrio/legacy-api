import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import oracledb from 'oracledb';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { getConnection } from 'typeorm';
import { Customer } from './entities/spt-customer';
import { CustomerInput } from './spt-customer.in';

@Resolver(Customer)
export class CustomerResolver {
  @Query(() => [Customer])
  @UseMiddleware(isAuth)
  async getAllCustomer(): Promise<Customer[] | undefined> {
    return await Customer.find();
  }

  @Query(() => Customer, { nullable: true })
  @UseMiddleware(isAuth)
  async getCustomer(
    @Arg('customerId') customerId: string
  ): Promise<Customer | undefined> {
    return await Customer.findOne(customerId);
  }

  @Mutation(() => Customer)
  @UseMiddleware(isAuth)
  async createCustomer(
    @Arg('input') input: CustomerInput
  ): Promise<Customer | undefined> {
    try {
      const sql = `
    BEGIN
      GBR_SPT_API.Create_Customer(:customerId, :customerName, :address, :phone :outCustomerId);
    END;
  `;
      const result = await getConnection().query(sql, [
        input.customerId,
        input.customerName,
        input.address,
        input.phone,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING }
      ]);
      const outCustomerId = result[0] as string;
      const data = Customer.findOne({
        customerId: outCustomerId
      });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => Customer, { nullable: true })
  @UseMiddleware(isAuth)
  async updateCustomer(
    @Arg('input') input: CustomerInput
  ): Promise<Customer | undefined> {
    try {
      const customer = await Customer.findOne({
        customerId: input.customerId
      });
      if (!customer) throw new Error('No data found.');
      const sql = `
    BEGIN
      GBR_SPT_API.Update_Customer(:customerId, :customerName,  :address, :phone, :outCustomerId);
    END;
  `;
      const result = await getConnection().query(sql, [
        input.customerId,
        input.customerName,
        input.address,
        input.phone,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING }
      ]);
      const outCustomerId = result[0];
      const data = Customer.findOne({
        customerId: outCustomerId
      });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => Customer)
  @UseMiddleware(isAuth)
  async deleteCustomer(
    @Arg('customerId') customerId: string
  ): Promise<Customer> {
    try {
      const customer = await Customer.findOne({
        customerId
      });
      if (!customer) throw new Error('No data found.');
      await Customer.delete({ customerId });
      return customer;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
