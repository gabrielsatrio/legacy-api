import { isAuth } from '@/middlewares/is-auth';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { IfsManufStructAlternateView } from './entities/ifs-struct-alternate.vw';

@Resolver(IfsManufStructAlternateView)
export class IfsManufStructAlternateResolver {
  @Query(() => [IfsManufStructAlternateView], { nullable: true })
  @UseMiddleware(isAuth)
  async getAlternate(
    @Arg('contract') contract: string,
    @Arg('partNo') partNo: string,
    @Arg('bomType') bomType: string
  ): Promise<IfsManufStructAlternateView[] | undefined> {
    return await IfsManufStructAlternateView.createQueryBuilder('MSA')
      .where('MSA.CONTRACT = :contract', { contract: contract })
      .andWhere('MSA.PART_NO = :partNo', { partNo: partNo })
      .andWhere('MSA.BOM_TYPE_DB = :bomType', { bomType: bomType })
      .andWhere(
        'MSA.ENG_CHG_LEVEL = part_revision_api.get_latest_revision(contract, part_no)'
      )
      .getMany();
  }
}
