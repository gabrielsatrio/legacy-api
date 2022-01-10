import { isAuth } from '@/middlewares/is-auth';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { Brackets, In, Like } from 'typeorm';
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
  ): Promise<IfsInventoryPartView | undefined> {
    return await IfsInventoryPartView.findOne(objId);
  }

  @Query(() => [IfsInventoryPartView], { nullable: true })
  @UseMiddleware(isAuth)
  async getSparePartsByContract(
    @Arg('contract', () => [String]) contract: string[]
  ): Promise<IfsInventoryPartView[] | undefined> {
    return await IfsInventoryPartView.find({
      where: { contract: In(contract), partStatus: 'A', partNo: Like('S__-%') },
      order: { partNo: 'ASC', contract: 'ASC' }
    });
  }
}
