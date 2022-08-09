import { ifs } from '@/database/data-sources';
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
    let sql = '';
    if (contract === 'AGT') {
      sql = `
        SELECT   alternative_no  AS "alternativeNo",
                 state           AS "state",
                 objId           AS "objId"
        FROM     MANUF_STRUCT_ALTERNATE@ifs8agt
        where bom_type_db = :bomType
        and   part_no = :partNo
        and   contract = :contract
        and   eng_chg_level = part_revision_api.get_latest_revision@ifs8agt(contract, part_no)
      `;
      return await ifs.query(sql, [bomType, partNo, contract]);
    } else {
      return await IfsManufStructAlternateView.createQueryBuilder('MSA')
        .where('MSA.CONTRACT = :contract', { contract })
        .andWhere('MSA.PART_NO = :partNo', { partNo })
        .andWhere('MSA.BOM_TYPE_DB = :bomType', { bomType })
        .andWhere(
          'MSA.ENG_CHG_LEVEL = part_revision_api.get_latest_revision(contract, part_no)'
        )
        .getMany();
    }
  }
}
