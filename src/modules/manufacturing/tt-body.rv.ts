import { ifs } from '@/database/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import oracledb from 'oracledb';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { Brackets } from 'typeorm/query-builder/Brackets';
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
    let sql = '';
    if (contract !== 'AGT') {
      return await IfsInventoryPartInStockView.createQueryBuilder('IPIS')
        .where('IPIS.CONTRACT = :contract', { contract: contract })
        .andWhere('IPIS.PART_NO = :partNo', { partNo: partNo })
        .andWhere(
          new Brackets((qb) => {
            qb.where(`IPIS.LOCATION_NO like :locationNo||'%'`, {
              locationNo: locationNo
            })
              .orWhere(`IPIS.LOCATION_NO like 'FG%'`)
              .orWhere(`IPIS.LOCATION_NO like 'RM2%'`);
          })
        )
        .andWhere(
          `IPIS.LOCATION_NO not like case when IPIS.CONTRACT in('AMI') then 'RM%JUAL' else 'NULL' end`
        )
        .andWhere(
          `IPIS.LOCATION_NO not like case when IPIS.CONTRACT in('AT2','AMI') then 'RM%NG' else 'NULL' end`
        )
        .andWhere(
          `IPIS.LOCATION_NO not like case when IPIS.CONTRACT in('AT2') then 'RM%SM' else 'NULL' end`
        )
        .andWhere(
          `IPIS.LOCATION_NO not like case when IPIS.CONTRACT in('AT2','AMI','AT4','AT1','ATD','ATS') then 'RM%QA1' else 'NULL' end`
        )
        .andWhere(
          `IPIS.LOCATION_NO not like case when IPIS.CONTRACT in('AT2','AT1') then 'RM%RTR' else 'NULL' end`
        )
        .andWhere(
          `IPIS.LOCATION_NO not like case when IPIS.CONTRACT in('AT2','AMI','AT4','AT1','ATD','ATS') then 'RM%QA2' else 'NULL' end`
        )
        .andWhere('IPIS.QTY_ONHAND > 0')
        .andWhere('IPIS.QTY_ONHAND != IPIS.QTY_RESERVED')
        .addOrderBy('IPIS.RECEIPT_DATE', 'ASC')
        .getMany();
    } else {
      sql = `
        SELECT contract      AS "contract",
               part_no       AS "partNo",
               LOT_BATCH_NO  AS "lotBatchNo",
               LOCATION_NO   AS "locationNo",
               QTY_ONHAND    AS "qtyOnhand",
               QTY_RESERVED  AS "qtyReserved",
               RECEIPT_DATE  AS "receiptDate",
               OBJID         AS "objId"
        FROM   INVENTORY_PART_IN_STOCK@ifs8agt
        WHERE  contract = :contract
        AND    part_no =: partNo
        AND    (location_no like :locationNo||'%'
                or location_no like 'FG%'
                or location_no like 'RM2%')
        and location_no not like case when contract in('AMI') then 'RM%JUAL' else 'NULL' end
        and location_no not like case when contract in('AT2','AMI') then 'RM%NG' else 'NULL' end
        and location_no not like case when contract in('AT2','AMI','AT4','AT1','ATD','ATS','AGT') then 'RM%QA1' else 'NULL' end
        and location_no not like case when contract in('AT2','AT1','AGT') then 'RM%RTR' else 'NULL' end
        and location_no not like case when contract in('AT2','AMI','AT4','AT1','ATD','ATS') then 'RM%QA2' else 'NULL' end
        and qty_onhand > 0
        and qty_reserved < qty_onhand
        order by receipt_date
      `;
      const result = await ifs.query(sql, [contract, partNo, locationNo]);
      return result;
    }
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

      const data = await TransportTaskBody.findOneBy({
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
