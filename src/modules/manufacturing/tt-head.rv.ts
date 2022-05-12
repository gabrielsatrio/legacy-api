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
            .orWhere("IP.PART_NO like 'BPRK%'");
        })
      )
      .andWhere(`ip.PART_STATUS in('A','I')`)
      .getMany();
  }

  @Query(() => String, { nullable: true })
  @UseMiddleware(isAuth)
  async getStockAllAvailStock(
    @Arg('contract') contract: string,
    @Arg('partNo') partNo: string
  ): Promise<string | undefined> {
    const test = await IfsInventoryPartInStockView.createQueryBuilder('IPIS')
      .where('IPIS.CONTRACT = :contract', { contract: contract })
      .select('SUM(IPIS.QTY_ONHAND - IPIS.QTY_RESERVED)', 'qtyAvail')
      .andWhere('IPIS.PART_NO = :partNo', { partNo: partNo })
      .andWhere(`IPIS.LOCATION_NO like 'RM%'`)
      .andWhere(
        `IPIS.LOCATION_NO not like case when contract ='AT2' then 'RM%NG' else 'NULL' end`
      )
      .andWhere(
        `IPIS.LOCATION_NO not like case when contract ='AT2' then 'RM%QA1' else 'NULL' end`
      )
      .andWhere(
        `IPIS.LOCATION_NO not like case when contract ='AT2' then 'RM%RTR' else 'NULL' end`
      )
      .andWhere(
        `IPIS.LOCATION_NO not like case when contract ='AT2' then 'RM%QA2' else 'NULL' end`
      )
      .andWhere('IPIS.QTY_ONHAND > 0')
      .andWhere('IPIS.QTY_ONHAND != IPIS.QTY_RESERVED')
      .getRawOne();

    return test.qtyAvail;
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
