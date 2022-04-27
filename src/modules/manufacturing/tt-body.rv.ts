import { ifs } from '@/database/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import oracledb from 'oracledb';
import { Arg, Mutation, Resolver, UseMiddleware } from 'type-graphql';
import { TransportTaskBody } from './entities/tt-detail';
import { TransportTaskBodyInput } from './tt-body.in';

@Resolver(TransportTaskBody)
export class TTBodyResolver {
  @Mutation(() => TransportTaskBody)
  @UseMiddleware(isAuth)
  async createTTBody(
    @Arg('input') input: TransportTaskBodyInput
  ): Promise<TransportTaskBody | null> {
    const sql = `
    BEGIN
    ATJ_TRANSPORT_TASK_API.CREATE_TT_LINE(
      :trasportTaskId,
      :lotBatchNo,
      :partNo,
      :quantity,
      :locationNo,
      :user,
      :type,
      :locationFr,
      :outLotBatchNo, :outTransportTaskId);
    END;
  `;

    let result;

    try {
      result = await ifs.query(sql, [
        input.transportTaskId,
        input.lotBatchNo,
        input.partNo,
        input.quantity,
        input.locationNo,
        input.user,
        input.type,
        input.locationFr,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        { dir: oracledb.BIND_OUT, type: oracledb.STRING }
      ]);
    } catch (err) {
      throw new Error(mapError(err));
    }
    const outLotBatchNo = result[0] as string;
    const outTransportTaskId = result[1] as string;

    const data = await TransportTaskBody.findOneBy({
      lotBatchNo: outLotBatchNo,
      transportTaskId: outTransportTaskId
    });

    return data;
  }

  @Mutation(() => TransportTaskBody, { nullable: true })
  @UseMiddleware(isAuth)
  async updateTTBody(
    @Arg('input') input: TransportTaskBodyInput
  ): Promise<TransportTaskBody | null> {
    const TTDetail = await TransportTaskBody.findOneBy({
      transportTaskId: input.transportTaskId,
      lotBatchNo: input.lotBatchNo
    });

    if (!TTDetail) {
      throw new Error('No data found.');
    }

    const sql = `
    BEGIN
    ATJ_TRANSPORT_TASK_API.UPDATE_TT_LINE(
      :trasportTaskId,
      :lotBatchNo,
      :quantity,
      :locationNo,
      :user,
      :type,
      :locationFr,
      :outLotBatchNo, :outTransportTaskId);
    END;
    `;

    let result;

    try {
      result = await ifs.query(sql, [
        input.transportTaskId,
        input.lotBatchNo,
        input.quantity,
        input.locationNo,
        input.user,
        input.type,
        input.locationFr,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        { dir: oracledb.BIND_OUT, type: oracledb.STRING }
      ]);
    } catch (err) {
      throw new Error(mapError(err));
    }

    const outLotBatchNo = result[0] as string;
    const outTransportTaskId = result[1] as string;

    const data = TransportTaskBody.findOneBy({
      transportTaskId: outTransportTaskId,
      lotBatchNo: outLotBatchNo
    });
    return data;
  }

  @Mutation(() => TransportTaskBody)
  @UseMiddleware(isAuth)
  async deleteTTLine(
    @Arg('transportTaskId') transportTaskId: string,
    @Arg('lotBatchNo') lotBatchNo: string,
    @Arg('locationFr') locationFr: string
  ): Promise<TransportTaskBody> {
    try {
      const ttLine = await TransportTaskBody.findOneBy({
        transportTaskId,
        lotBatchNo
      });

      if (!ttLine) {
        throw new Error('No data found.');
      }

      const sql = `
      BEGIN
      ATJ_TRANSPORT_TASK_API.delete_line_tt(
        :transportTaskId,
        :lotBatchNo,
        :locationFr);
      END;
    `;

      await ifs.query(sql, [transportTaskId, lotBatchNo, locationFr]);

      return ttLine;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
