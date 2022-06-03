import { isAuth } from '@/middlewares/is-auth';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { IfsProdStructureView } from './entities/ifs-prod-structure';

@Resolver(IfsProdStructureView)
export class IfsProdStructureResolver {
  @Query(() => [IfsProdStructureView], { nullable: true })
  @UseMiddleware(isAuth)
  async getStructureComponents(
    @Arg('contract') contract: string,
    @Arg('partNo') partNo: string,
    @Arg('bomType') bomType: string,
    @Arg('alternativeNo') alternativeNo: string
  ): Promise<IfsProdStructureView[] | undefined> {
    return await IfsProdStructureView.createQueryBuilder('PS')
      .where('PS.CONTRACT = :contract', { contract: contract })
      .andWhere('PS.PART_NO = :partNo', { partNo: partNo })
      .andWhere('PS.BOM_TYPE_DB = :bomType', { bomType: bomType })
      .andWhere('PS.ALTERNATIVE_NO = :alternativeNo', {
        alternativeNo: alternativeNo
      })
      .andWhere(
        'PS.ENG_CHG_LEVEL = part_revision_api.get_latest_revision(contract, part_no)'
      )
      .orderBy('PS.LINE_ITEM_NO')
      .getMany();
  }
}
