import { ifs } from '@/database/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import oracledb from 'oracledb';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { IfsInventoryPartInStockView } from '../inventory/entities/ifs-inv-part-in-stock.vw';
import { TransportTaskBody } from './entities/tt-detail';
import { TransportTaskBodyInput } from './tt-body.in';

@Resolver(TransportTaskBody)
export class TTBodyResolver {
  @Query(() => [IfsInventoryPartInStockView], { nullable: true })
  @UseMiddleware(isAuth)
  async getStockTransportTask(
    @Arg('contract') contract: string,
    @Arg('partNo') partNo: string,
    @Arg('locationNo') locationNo: string
  ): Promise<IfsInventoryPartInStockView[] | undefined> {
    return await IfsInventoryPartInStockView.createQueryBuilder('IPIS')
      .where('IPIS.CONTRACT = :contract', { contract: contract })
      .andWhere('IPIS.PART_NO = :partNo', { partNo: partNo })
      .andWhere(`IPIS.LOCATION_NO like :locationNo||'%'`, {
        locationNo: locationNo
      })
      .andWhere(
        `IPIS.LOCATION_NO not like case when IPIS.CONTRACT ='AT2' then 'RM%NG' else 'NULL' end`
      )
      .andWhere(
        `IPIS.LOCATION_NO not like case when IPIS.CONTRACT ='AT2' then 'RM%QA1' else 'NULL' end`
      )
      .andWhere(
        `IPIS.LOCATION_NO not like case when IPIS.CONTRACT ='AT2' then 'RM%RTR' else 'NULL' end`
      )
      .andWhere(
        `IPIS.LOCATION_NO not like case when IPIS.CONTRACT ='AT2' then 'RM%QA2' else 'NULL' end`
      )
      .andWhere('IPIS.QTY_ONHAND > 0')
      .andWhere('IPIS.QTY_ONHAND != IPIS.QTY_RESERVED')
      .getMany();
  }

  @Mutation(() => TransportTaskBody)
  @UseMiddleware(isAuth)
  async createTTBody(
    @Arg('input') input: TransportTaskBodyInput
  ): Promise<TransportTaskBody | null> {
    try {
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

      const result = await ifs.query(sql, [
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

      const outLotBatchNo = result[0] as string;
      const outTransportTaskId = result[1] as string;

      const data = await TransportTaskBody.findOneBy({
        lotBatchNo: outLotBatchNo,
        transportTaskId: outTransportTaskId
      });

      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => TransportTaskBody, { nullable: true })
  @UseMiddleware(isAuth)
  async updateTTBody(
    @Arg('input') input: TransportTaskBodyInput
  ): Promise<TransportTaskBody | null> {
    try {
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

      const result = await ifs.query(sql, [
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

      const outLotBatchNo = result[0] as string;
      const outTransportTaskId = result[1] as string;

      const data = TransportTaskBody.findOneBy({
        transportTaskId: outTransportTaskId,
        lotBatchNo: outLotBatchNo
      });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
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
