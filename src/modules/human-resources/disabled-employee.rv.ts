import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { DisabledEmployeesInput } from './disabled-employee.in';
import { DisabledEmployees } from './entities/disabled-employee';
import { DisabledEmployeesView } from './entities/disabled-employee.vw';

@Resolver(DisabledEmployees)
export class DisabledEmployeesResolver {
  @Query(() => Boolean)
  @UseMiddleware(isAuth)
  async checkDisabledEmployeesExist(
    @Arg('employeeId') employeeId: string
  ): Promise<boolean> {
    try {
      return (await this.getDisabledEmployees(employeeId)) ? true : false;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [DisabledEmployeesView])
  @UseMiddleware(isAuth)
  async getAllDisabledEmployees(): Promise<
    DisabledEmployeesView[] | undefined
  > {
    try {
      return await DisabledEmployeesView.find();
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => DisabledEmployeesView, { nullable: true })
  @UseMiddleware(isAuth)
  async getDisabledEmployees(
    @Arg('employeeId') employeeId: string
  ): Promise<DisabledEmployeesView | null> {
    try {
      return await DisabledEmployeesView.findOneBy({ employeeId });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => DisabledEmployees)
  @UseMiddleware(isAuth)
  async createDisabledEmployees(
    @Arg('input') input: DisabledEmployeesInput
  ): Promise<DisabledEmployees | undefined> {
    try {
      const existingData = await DisabledEmployees.findOneBy({
        employeeId: input.employeeId
      });
      if (existingData) throw new Error('Data already exists.');
      const data = DisabledEmployees.create({
        ...input
      });
      const result = await DisabledEmployees.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => DisabledEmployees, { nullable: true })
  @UseMiddleware(isAuth)
  async updateDisabledEmployees(
    @Arg('input') input: DisabledEmployeesInput
  ): Promise<DisabledEmployees | undefined> {
    try {
      const data = await DisabledEmployees.findOneBy({
        employeeId: input.employeeId
      });
      if (!data) throw new Error('No data found.');
      DisabledEmployees.merge(data, { ...input });
      const result = await DisabledEmployees.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => DisabledEmployees)
  @UseMiddleware(isAuth)
  async deleteDisabledEmployees(
    @Arg('employeeId') employeeId: string
  ): Promise<DisabledEmployees> {
    try {
      const data = await DisabledEmployees.findOneBy({ employeeId });
      if (!data) throw new Error('No data found.');
      await DisabledEmployees.delete({ employeeId });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
