import { ifs } from '@/database/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { IfsPartCatalogView } from './entities/ifs-part-catalog.vw';

@Resolver(IfsPartCatalogView)
export class IfsPartCatalogResolver {
  @Query(() => IfsPartCatalogView)
  @UseMiddleware(isAuth)
  async getPartCatalog(
    @Arg('partNo', () => String) partNo: string
  ): Promise<IfsPartCatalogView | null> {
    try {
      return await IfsPartCatalogView.findOneBy({ partNo });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => String)
  @UseMiddleware(isAuth)
  async getPartCatalogUom(
    @Arg('partNo', () => String) partNo: string
  ): Promise<string | undefined> {
    try {
      const query = `
      SELECT LISTAGG(unit_code, ', ') WITHIN GROUP (ORDER BY unit_code) AS "uom"
      FROM   (SELECT   part_no,
                      unit_code
              FROM     part_catalog
              WHERE    part_no = :p_part_no
              GROUP BY part_no, unit_code
              UNION
              SELECT   part_no,
                      unit_code
              FROM     part_catalog@ifs8agt
              WHERE    part_no = :p_part_no
              GROUP BY part_no, unit_code)
      `;
      const result = await ifs.query(query, [partNo]);
      return result[0].uom || ' ';
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => String)
  @UseMiddleware(isAuth)
  async getPartCatalogSite(
    @Arg('partNo', () => String) partNo: string
  ): Promise<string | undefined> {
    try {
      const isExistAtQuery = `
      SELECT NVL(MAX(1), 0) as "exist"
      FROM   part_catalog
      WHERE  part_no = :p_part_no
      `;
      const isExistAt = await ifs.query(isExistAtQuery, [partNo]);

      const isExistAgQuery = `
      SELECT NVL(MAX(1), 0) as "exist"
      FROM   part_catalog@ifs8agt
      WHERE  part_no = :p_part_no
      `;
      const isExistAg = await ifs.query(isExistAgQuery, [partNo]);
      if (isExistAg[0].exist === 1 && isExistAt[0].exist === 1) return 'AT, AG';
      else if (isExistAt[0].exist === 1) return 'AT';
      else if (isExistAg[0].exist === 1) return 'AG';
      else return ' ';
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [String])
  @UseMiddleware(isAuth)
  async getInfoTextSplit(
    @Arg('partNo', () => String) partNo: string
  ): Promise<string[] | undefined> {
    try {
      const result = await IfsPartCatalogView.findOneBy({ partNo });
      const infoTextSplit = result?.infoText?.split(/\r?\n/);
      if (infoTextSplit) return infoTextSplit;
      else return ['Alias: ', 'Info: '];
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [IfsPartCatalogView])
  @UseMiddleware(isAuth)
  async getPartCatalogList(
    @Arg('partCode', () => String, { nullable: true }) partCode: string,
    @Arg('description', () => String, { nullable: true }) description: string
  ): Promise<IfsPartCatalogView[] | undefined> {
    try {
      const code: string[] = partCode
        ? partCode.trim().toUpperCase().split(', ')
        : [];

      const words: string[] = description
        ? description.trim().toUpperCase().split(' ')
        : [];

      let codeFilter = `SELECT part_no, description, std_name_id, unit_code, info_text
      FROM part_catalog`;

      if (code.length > 0)
        for (let i = 0; i < code.length; i++) {
          if (i === 0)
            codeFilter = codeFilter.concat(
              `\n WHERE UPPER(part_no) LIKE '${code[i].toUpperCase()}%'`
            );
          else
            codeFilter = codeFilter.concat(
              `\n OR UPPER(part_no) LIKE '${code[i].toUpperCase()}%'`
            );
        }

      let sql = `SELECT part_no as "partNo",
      description as "description",
      unit_code as "unitCode",
      std_name_id as "stdNameId",
      info_text as "infoText"
      FROM (${codeFilter})`;

      if (words.length > 0)
        for (let i = 0; i < words.length; i++) {
          if (i === 0)
            sql = sql.concat(`\nWHERE UPPER(description) LIKE '%${words[i]}%'`);
          else
            sql = sql.concat(`\nAND UPPER(description) LIKE '%${words[i]}%'`);
        }

      return await ifs.query(sql);
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
