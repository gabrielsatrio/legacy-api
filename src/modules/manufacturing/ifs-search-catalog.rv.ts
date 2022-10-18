import { ifs } from '@/database/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { IfsPartCatalogView } from './entities/ifs-part-catalog.vw';

@Resolver(IfsPartCatalogView)
export class IfsPartCatalogResolver {
  @Query(() => [IfsPartCatalogView])
  @UseMiddleware(isAuth)
  async getPartCatalogList(
    @Arg('partCode', () => String, { nullable: true }) partCode: string,
    @Arg('description', () => String, { nullable: true }) description: string
  ): Promise<IfsPartCatalogView[] | undefined> {
    try {
      const words: string[] = description
        ? description.trim().toUpperCase().split(' ')
        : [];

      const result = IfsPartCatalogView.createQueryBuilder('PC');

      if (partCode)
        result.where(`UPPER(PC.PART_NO) LIKE '${partCode.toUpperCase()}%'`);
      if (words.length > 0)
        for (let i = 0; i < words.length; i++) {
          if (i === 0 && !partCode) {
            result.where(`UPPER(PC.DESCRIPTION) LIKE '%${words[i]}%'`);
          } else {
            result.andWhere(`UPPER(PC.DESCRIPTION) LIKE '%${words[i]}%'`, {
              word: words[i]
            });
          }
        }
      return await result.getMany();
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

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
  async getUOM(
    @Arg('partNo', () => String) partNo: string
  ): Promise<string | undefined> {
    try {
      const query = `SELECT vky_part_catalog_search_api.get_uom( :part_no) as "uom"
                    FROM DUAL`;
      const result = await ifs.query(query, [partNo]);
      return result[0].uom;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => String)
  @UseMiddleware(isAuth)
  async getSite(
    @Arg('partNo', () => String) partNo: string
  ): Promise<string | undefined> {
    try {
      const query = `SELECT vky_part_catalog_search_api.get_contract( :part_no) as "site"
                    FROM DUAL`;
      const result = await ifs.query(query, [partNo]);
      return result[0].site;
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
      return infoTextSplit;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
