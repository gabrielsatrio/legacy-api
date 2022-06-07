import { ifs } from '@/database/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { Brackets, In, Like, Not } from 'typeorm';
import { IfsInventoryPartView } from '../inventory/entities/ifs-inv-part.vw';

@Resolver(IfsInventoryPartView)
export class IfsInventoryPartResolver {
  @Query(() => [IfsInventoryPartView], { nullable: true })
  @UseMiddleware(isAuth)
  async getInventoryPartsByContract(
    @Arg('contract', () => [String]) contract: string[]
  ): Promise<IfsInventoryPartView[] | undefined> {
    return await IfsInventoryPartView.find({
      where: { contract: In(contract), partStatus: 'A' },
      order: { partNo: 'ASC', contract: 'ASC' }
    });
  }

  @Query(() => [IfsInventoryPartView], { nullable: true })
  @UseMiddleware(isAuth)
  async getPartMaster(
    @Arg('contract') contract: string
  ): Promise<IfsInventoryPartView[] | undefined> {
    return await IfsInventoryPartView.createQueryBuilder('IP')
      .where('IP.CONTRACT = :contract', { contract: contract })
      .andWhere(
        new Brackets((qb) => {
          qb.where("IP.PART_NO like 'MFD%'")
            .orWhere("IP.PART_NO like 'FD%'")
            .orWhere("IP.PART_NO like 'Y%'")
            .orWhere("IP.PART_NO like 'MY%'")
            .orWhere("IP.PART_NO like 'BM%'")
            .orWhere("IP.PART_NO like 'MM%'");
        })
      )
      .andWhere(`ip.PART_STATUS = 'A'`)
      .getMany();
  }

  @Query(() => [IfsInventoryPartView], { nullable: true })
  @UseMiddleware(isAuth)
  async getDDPAllComponentPart(
    @Arg('contract') contract: string,
    @Arg('partNoOne') partNoOne: string,
    @Arg('partNoTwo') partNoTwo: string
  ): Promise<IfsInventoryPartView[] | undefined> {
    return await IfsInventoryPartView.createQueryBuilder('IP')
      .where('IP.CONTRACT = :contract', { contract: contract })
      .andWhere(
        new Brackets((qb) => {
          qb.where('IP.PART_NO like :partNoOne', {
            partNoOne: partNoOne + '%'
          }).orWhere('IP.PART_NO like :partNoTwo', {
            partNoTwo: partNoTwo + '%'
          });
        })
      )
      .andWhere(`IP.PART_STATUS = 'A'`)
      .getMany();
  }

  @Query(() => [IfsInventoryPartView], { nullable: true })
  @UseMiddleware(isAuth)
  async getAllByPartNo(
    @Arg('contract') contract: string,
    @Arg('partNo') partNo: string
  ): Promise<IfsInventoryPartView[] | undefined> {
    return await IfsInventoryPartView.createQueryBuilder('IP')
      .where('IP.CONTRACT = :contract', { contract: contract })
      .andWhere('IP.PART_NO like :partNo', { partNo: partNo + '%' })
      .andWhere(`IP.PART_STATUS = 'A'`)
      .getMany();
  }

  @Query(() => IfsInventoryPartView, { nullable: true })
  @UseMiddleware(isAuth)
  async getInventoryPartByObjId(
    @Arg('objId') objId: string
  ): Promise<IfsInventoryPartView | null> {
    return await IfsInventoryPartView.findOneBy({ objId });
  }

  @Query(() => [IfsInventoryPartView], { nullable: true })
  @UseMiddleware(isAuth)
  async getSparePartsByContract(
    @Arg('contract', () => [String]) contract: string[]
  ): Promise<IfsInventoryPartView[] | null> {
    return await IfsInventoryPartView.find({
      where: {
        contract: In(contract),
        partStatus: Not('O'),
        partNo: Like('S__-%')
      },
      order: { partNo: 'ASC', contract: 'ASC' }
    });
  }

  @Query(() => IfsInventoryPartView, { nullable: true })
  @UseMiddleware(isAuth)
  async getPartDescByOrderNo(
    @Arg('orderNo') orderNo: string
  ): Promise<Record<string, string | null>> {
    try {
      const sql = `SELECT inventory_part_api.get_description(shop_ord_api.get_contract( :orderno, '*', '*'), shop_ord_api.get_part_no( :orderno, '*', '*')) as "description"
      FROM   DUAL`;
      const result = await ifs.query(sql, [orderNo]);
      const description = result[0].description;
      return { description };
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => String, { nullable: true })
  @UseMiddleware(isAuth)
  async getAttrValue(
    @Arg('partNo') partNo: string,
    @Arg('contract') contract: string,
    @Arg('attrValue') attrValue: string
  ): Promise<string | null> {
    try {
      const sql = `select ATJ_INVENTORY_PART_API.GET_ATTR_VALUE(:partNo, :contract, :attrValue) as "attrValue" from dual`;
      const result = await ifs.query(sql, [partNo, contract, attrValue]);
      return result[0].attrValue;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
