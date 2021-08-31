import { isAuth } from '@/middlewares/is-auth';
import { setErrors } from '@/utils/set-errors';
import oracledb from 'oracledb';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { getConnection } from 'typeorm';
import { Customer } from './entities/spt-customer';
import { CustomerResponse } from './spt-customer.dr';
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

  @Mutation(() => CustomerResponse)
  @UseMiddleware(isAuth)
  async createCustomer(
    @Arg('input') input: CustomerInput
  ): Promise<CustomerResponse | undefined> {
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
      return setErrors(err.message);
    }
    const outCustomerId = result[0] as string;
    const data = Customer.findOne({
      customerId: outCustomerId
    });
    return { success: true, data };
  }

  @Mutation(() => CustomerResponse, { nullable: true })
  @UseMiddleware(isAuth)
  async updateCustomer(
    @Arg('input') input: CustomerInput
  ): Promise<CustomerResponse | undefined> {
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
      return setErrors(err.message);
    }
    const outCustomerId = result[0];
    const data = Customer.findOne({
      customerId: outCustomerId
    });
    return { success: true, data };
  }

  @Mutation(() => CustomerResponse)
  @UseMiddleware(isAuth)
  async deleteCustomer(
    @Arg('customerId') customerId: string
  ): Promise<CustomerResponse> {
    //const createdBy: string = req.session.userId;
    const customer = await Customer.findOne({
      customerId
    });
    if (!customer) return setErrors('No data found.');
    try {
      await Customer.delete({ customerId });
      return { success: true };
    } catch (err) {
      return setErrors(err.message);
    }
  }
}
