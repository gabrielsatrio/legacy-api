import { ifs } from '@/database/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import oracledb from 'oracledb';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { Customer } from './entities/spt-customer';
import { CustomerInput } from './spt-customer.in';

@Resolver(Customer)
export class CustomerResolver {
  @Query(() => [Customer])
  @UseMiddleware(isAuth)
  async getAllCustomer(): Promise<Customer[] | undefined> {
    try {
      return await Customer.find();
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => Customer, { nullable: true })
  @UseMiddleware(isAuth)
  async getCustomer(
    @Arg('customerId') customerId: string
  ): Promise<Customer | null> {
    try {
      return await Customer.findOneBy({ customerId });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => Customer)
  @UseMiddleware(isAuth)
  async createCustomer(
    @Arg('input') input: CustomerInput
  ): Promise<Customer | null> {
    try {
      const sql = `
    BEGIN
      GBR_SPT_API.Create_Customer(:customerId, :customerName, :address, :phone :outCustomerId);
    END;
  `;
      const result = await ifs.query(sql, [
        input.customerId,
        input.customerName,
        input.address,
        input.phone,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING }
      ]);
      const outCustomerId = result[0] as string;
      const data = Customer.findOneBy({
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
  ): Promise<Customer | null> {
    try {
      const customer = await Customer.findOneBy({
        customerId: input.customerId
      });
      if (!customer) throw new Error('No data found.');
      const sql = `
    BEGIN
      GBR_SPT_API.Update_Customer(:customerId, :customerName,  :address, :phone, :outCustomerId);
    END;
  `;
      const result = await ifs.query(sql, [
        input.customerId,
        input.customerName,
        input.address,
        input.phone,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING }
      ]);
      const outCustomerId = result[0];
      const data = Customer.findOneBy({
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
      const customer = await Customer.findOneBy({
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
