import { ifs } from '@/database/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import oracledb from 'oracledb';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { Brackets, In } from 'typeorm';
import { IfsInventoryPartInStockView } from '../inventory/entities/ifs-inv-part-in-stock.vw';
import { IfsInventoryPartView } from '../inventory/entities/ifs-inv-part.vw';
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

  @Query(() => [IfsInventoryPartView], { nullable: true })
  @UseMiddleware(isAuth)
  async getPartTTBahan(
    @Arg('contract') contract: string
  ): Promise<IfsInventoryPartView[] | undefined> {
    let sql = '';
    if (contract !== 'AGT') {
      return await IfsInventoryPartView.createQueryBuilder('IP')
        .where('IP.CONTRACT = :contract', { contract: contract })
        .andWhere(
          new Brackets((qb) => {
            qb.where("IP.PART_NO like 'Y%'")
              .orWhere("IP.PART_NO like 'T%'")
              .orWhere("IP.PART_NO like 'MT%'")
              .orWhere("IP.PART_NO like 'MY%'")
              .orWhere("IP.PART_NO like 'C%'")
              .orWhere("IP.PART_NO like 'BPPL%'")
              .orWhere("IP.PART_NO like 'NW%'")
              .orWhere("IP.PART_NO like 'BA%'")
              .orWhere("IP.PART_NO like 'MWV%'")
              .orWhere("IP.PART_NO like 'MNV%'")
              .orWhere("IP.PART_NO like 'FA%'")
              .orWhere("IP.PART_NO like 'FB%'")
              .orWhere("IP.PART_NO like 'FX%'")
              .orWhere("IP.PART_NO like 'FZ%'")
              .orWhere("IP.PART_NO like 'MF%'")
              .orWhere("IP.PART_NO like 'BPRK%'");
          })
        )
        .andWhere(`ip.PART_STATUS in('A','I')`)
        .getMany();
    } else {
      sql = `
      SELECT part_no      AS "partNo",
             contract     AS "contract",
             description  AS "description",
             unit_meas    AS "unitMeas",
             part_status  AS "partStatus",
             objid        AS "objId"
      FROM   inventory_part@ifs8agt
      WHERE  contract = :contract
      and    (PART_NO like 'Y%' OR
              PART_NO like 'T%' OR
              PART_NO like 'MT%' OR
              PART_NO like 'MY%' OR
              PART_NO like 'C%' OR
              PART_NO like 'BPPL%' OR
              PART_NO like 'NW%' OR
              PART_NO like 'BA%' OR
              PART_NO like 'MWV%' OR
              PART_NO like 'MNV%' OR
              PART_NO like 'FA%' OR
              PART_NO like 'FB%' OR
              PART_NO like 'FX%' OR
              PART_NO like 'FZ%' OR
              PART_NO like 'MF%' OR
              PART_NO like 'BPRK%' )
      AND    part_status in('A','I')

    `;
      const result = await ifs.query(sql, [contract]);
      return result;
    }
  }

  @Query(() => [IfsInventoryPartView], { nullable: true })
  @UseMiddleware(isAuth)
  async getPartTTBahanAsync(
    @Arg('contract') contract: string,
    @Arg('partNo') partNo: string
  ): Promise<IfsInventoryPartView[] | undefined> {
    let sql = '';
    if (contract !== 'AGT') {
      return await IfsInventoryPartView.createQueryBuilder('IP')
        .where('IP.CONTRACT = :contract', { contract: contract })
        .andWhere(
          new Brackets((qb) => {
            qb.where("IP.PART_NO like '%'||UPPER(:partNo)||'%'", {
              partNo: partNo
            }).orWhere("IP.DESCRIPTION like '%'||UPPER(:partNo)||'%'", {
              partNo: partNo
            });
          })
        )
        .andWhere(`ip.PART_STATUS in('A','I')`)
        .getMany();
    } else {
      sql = `
      SELECT part_no      AS "partNo",
             contract     AS "contract",
             description  AS "description",
             unit_meas    AS "unitMeas",
             part_status  AS "partStatus",
             objid        AS "objId"
      FROM   inventory_part@ifs8agt
      WHERE  contract = :contract
      and    (PART_NO like '%'||UPPER(:partNo)||'%' OR
              description like '%'||UPPER(:partNo)||'%' )
      AND    part_status in('A','I')

    `;
      const result = await ifs.query(sql, [contract, partNo]);
      return result;
    }
  }

  @Query(() => String, { nullable: true })
  @UseMiddleware(isAuth)
  async getStockAllAvailStock(
    @Arg('contract') contract: string,
    @Arg('partNo') partNo: string
  ): Promise<string | undefined> {
    let sql;
    if (contract !== 'AGT') {
      const data = await IfsInventoryPartInStockView.createQueryBuilder('IPIS')
        .where('IPIS.CONTRACT = :contract', { contract: contract })
        .select('SUM(IPIS.QTY_ONHAND - IPIS.QTY_RESERVED)', 'qtyAvail')
        .andWhere('IPIS.PART_NO = :partNo', { partNo: partNo })
        .andWhere(
          new Brackets((qb) => {
            qb.where(`IPIS.LOCATION_NO like 'RM%'`)
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
          `IPIS.LOCATION_NO not like case when IPIS.CONTRACT in('AT2') then 'RM%NG' else 'NULL' end`
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
        .getRawOne();

      return data.qtyAvail;
    } else {
      sql = `
        SELECT SUM(QTY_ONHAND - QTY_RESERVED) AS "qtyAvail"
        FROM   INVENTORY_PART_IN_STOCK@ifs8agt
        WHERE  contract = :contract
        AND    part_no =: partNo
        AND    (location_no like 'RM%'
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
      const result = await ifs.query(sql, [contract, partNo]);
      return result[0].qtyAvail;
    }
  }

  @Mutation(() => TransportTaskHead)
  @UseMiddleware(isAuth)
  async createTTAuto(
    @Arg('input') input: TransportTaskHeadInput
  ): Promise<TransportTaskHead | null> {
    try {
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

      const result = await ifs.query(sql, [
        input.contract,
        input.orderQty,
        input.partNo,
        input.locationNo,
        input.user,
        input.type,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        { dir: oracledb.BIND_OUT, type: oracledb.STRING }
      ]);
      const outContract = result[0] as string;
      const outTransportTaskId = result[1] as string;

      const data = await TransportTaskHead.findOneBy({
        contract: outContract,
        transportTaskId: outTransportTaskId
      });

      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => TransportTaskHead, { nullable: true })
  @UseMiddleware(isAuth)
  async updateTTAuto(
    @Arg('input') input: TransportTaskHeadInput
  ): Promise<TransportTaskHead | null> {
    try {
      const TTHead = await TransportTaskHead.findOneBy({
        transportTaskId: input.transportTaskId,
        contract: input.contract
      });

      if (!TTHead) {
        throw new Error('No data found.');
      }

      const sql = `
      BEGIN
      ATJ_TRANSPORT_TASK_API.UPDATE_TT_AUTO(
        :contract,
        :transportTaskId,
        :orderQty,
        :partNo,
        :locationNo,
        :user,
        :type,
        :outContract, :outTransportTaskId);
      END;
      `;

      const result = await ifs.query(sql, [
        input.contract,
        input.transportTaskId,
        input.orderQty,
        input.partNo,
        input.locationNo,
        input.user,
        input.type,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        { dir: oracledb.BIND_OUT, type: oracledb.STRING }
      ]);

      const outContract = result[0] as string;
      const outTransportTaskId = result[1] as string;

      const data = TransportTaskHead.findOneBy({
        transportTaskId: outTransportTaskId,
        contract: outContract
      });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => TransportTaskHead)
  @UseMiddleware(isAuth)
  async deleteTT(
    @Arg('transportTaskId') transportTaskId: string
  ): Promise<TransportTaskHead> {
    try {
      const tt = await TransportTaskHead.findOneBy({
        transportTaskId
      });

      if (!tt) {
        throw new Error('No data found.');
      }

      const sql = `
      BEGIN
      ATJ_TRANSPORT_TASK_API.delete_tt(
        :transportTaskId);
      END;
    `;

      await ifs.query(sql, [transportTaskId]);

      return tt;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
