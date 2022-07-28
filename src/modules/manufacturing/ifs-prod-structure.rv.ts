import { ifs } from '@/database/data-sources';
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
    let sql = '';
    if (contract === 'AGT') {
      sql = `
        SELECT   line_item_no       AS "lineItemNo",
                 component_part     AS "componentPart",
                 COMP_DESC          AS "componentDesc",
                 QTY_PER_ASSEMBLY   AS "qtyPerAssembly",
                 COMPONENT_SCRAP    AS "componentScrap",
                 SHRINKAGE_FACTOR   AS "shrinkageFactor",
                 ALTERNATIVE_NO     AS "alternativeNo",
                 objId              AS "objId"
        FROM     ATJ_PROD_STRUCTURE_V@ifs8agt
        where bom_type_db = :bomType
        and   part_no = :partNo
        and   contract = :contract
        and   alternative_no = :alternativeNo
        and   ENG_CHG_LEVEL = part_revision_api.get_latest_revision@ifs8agt(contract, part_no)
        order by line_item_no
      `;
      return await ifs.query(sql, [bomType, partNo, contract, alternativeNo]);
    } else {
      return await IfsProdStructureView.createQueryBuilder('PS')
        .where('PS.CONTRACT = :contract', { contract })
        .andWhere('PS.PART_NO = :partNo', { partNo })
        .andWhere('PS.BOM_TYPE_DB = :bomType', { bomType })
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
}
