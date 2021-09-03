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
    return Customer.find();
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
    let result;
    //const createdBy: string = req.session.userId;
    const sql = `
    BEGIN
      GBR_SPT_API.Create_Customer(:customerId, :customerName, :address, :phone :outCustomerId);
    END;
  `;
    try {
      result = await getConnection().query(sql, [
        input.customerId,
        input.customerName,
        input.address,
        input.phone,
        //createdBy
        { dir: oracledb.BIND_OUT, type: oracledb.STRING }
      ]);
    } catch (err) {
      throw new Error(mapError(err));
    }
    const outCustomerId = result[0] as string;
    const data = Customer.findOne({
      customerId: outCustomerId
    });
    return data;
  }

  @Mutation(() => Customer, { nullable: true })
  @UseMiddleware(isAuth)
  async updateCustomer(
    @Arg('input') input: CustomerInput
  ): Promise<Customer | undefined> {
    let result;
    const customer = await Customer.findOne({
      customerId: input.customerId
    });
    if (!customer) {
      return undefined;
    }
    const sql = `
    BEGIN
      GBR_SPT_API.Update_Customer(:customerId, :customerName,  :address, :phone, :outCustomerId);
    END;
  `;
    try {
      result = await getConnection().query(sql, [
        input.customerId,
        input.customerName,
        input.address,
        input.phone,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING }
      ]);
    } catch (err) {
      throw new Error(mapError(err));
    }
    const outCustomerId = result[0];
    const data = Customer.findOne({
      customerId: outCustomerId
    });
    return data;
  }

  @Mutation(() => Customer)
  @UseMiddleware(isAuth)
  async deleteCustomer(
    @Arg('customerId') customerId: string
  ): Promise<Customer> {
    //const createdBy: string = req.session.userId;
    const customer = await Customer.findOne({
      customerId
    });
    if (!customer) throw new Error('No data found.');
    try {
      await Customer.delete({ customerId });
      return customer;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
