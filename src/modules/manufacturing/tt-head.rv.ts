import { ifs } from '@/database/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import oracledb from 'oracledb';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { In } from 'typeorm';
import { TransportTaskHead } from './entities/tt-header';
import { TransportTaskHeadInput } from './tt-head.in';

@Resolver(TransportTaskHead)
export class TTHeadResolver {
  @Query(() => [TransportTaskHead], { nullable: true })
  @UseMiddleware(isAuth)
  async getTTHeads(
    @Arg('contract', () => [String])
    contract: string[]
  ): Promise<TransportTaskHead[] | undefined> {
    return await TransportTaskHead.find({
      relations: { details: true },
      where: { contract: In(contract) }
    });
  }

  @Mutation(() => TransportTaskHead)
  @UseMiddleware(isAuth)
  async createTTAuto(
    @Arg('input') input: TransportTaskHeadInput
  ): Promise<TransportTaskHead | null> {
    const sql = `
    BEGIN
    ATJ_TRANSPORT_TASK_API.CREATE_TT_AUTO(
      :contract,
      :orderQty,
      :partNo,
      :locationNo,
      :user,
      :type,
      :outContract, :outTransportTaskId);
    END;
  `;

    let result;

    try {
      result = await ifs.query(sql, [
        input.contract,
        input.orderQty,
        input.partNo,
        input.locationNo,
        input.user,
        input.type,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        { dir: oracledb.BIND_OUT, type: oracledb.STRING }
      ]);
    } catch (err) {
      throw new Error(mapError(err));
    }
    const outContract = result[0] as string;
    const outTransportTaskId = result[1] as string;

    const data = await TransportTaskHead.findOneBy({
      contract: outContract,
      transportTaskId: outTransportTaskId
    });

    return data;
  }
}
