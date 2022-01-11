import { isAuth } from '@/middlewares/is-auth';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { getConnection, In } from 'typeorm';
import { mapError } from './../../utils/map-error';
import { YarnMachine } from './entities/yarn-machine';
import { YarnMachineInput } from './yarn-machine.in';

@Resolver(YarnMachine)
export class YarnMachineResolver {
  @Query(() => [YarnMachine], { nullable: true })
  @UseMiddleware(isAuth)
  async getYarnMachine(
    @Arg('contract', () => [String]) contract: string[]
  ): Promise<YarnMachine[] | undefined> {
    return await YarnMachine.find({
      contract: In(contract)
    });
  }

  @Mutation(() => YarnMachine)
  @UseMiddleware(isAuth)
  async createYarnMachine(
    @Arg('input') input: YarnMachineInput
  ): Promise<YarnMachine | undefined> {
    try {
      const sql = `SELECT nvl(max(id)+1,1) as "id" from GBR_YARN_MACHINE`;
      const result = await getConnection().query(sql);
      const data = YarnMachine.create({
        ...input,
        id: result[0].id
      });
      const results = await YarnMachine.save(data);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => YarnMachine, { nullable: true })
  @UseMiddleware(isAuth)
  async updateYarnMachine(
    @Arg('input') input: YarnMachineInput
  ): Promise<YarnMachine | undefined> {
    try {
      const data = await YarnMachine.findOne({
        id: input.id
      });
      if (!data) throw new Error('No data found.');
      YarnMachine.merge(data, input);
      const results = await YarnMachine.save(data);
      return results;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => YarnMachine)
  @UseMiddleware(isAuth)
  async deleteYarnMachine(@Arg('id') id: number): Promise<YarnMachine> {
    try {
      const data = await YarnMachine.findOne({
        id: id
      });
      if (!data) throw new Error('No data found.');
      await YarnMachine.delete({ id });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
