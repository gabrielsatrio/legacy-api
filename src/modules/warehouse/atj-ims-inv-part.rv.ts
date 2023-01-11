import { ifs } from '@/database/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { ImsInvPart } from './entities/atj-ims-inv-part';
import { ImsInvPartView } from './entities/atj-ims-inv-part.vw';

@Resolver(ImsInvPart)
export class ImsInvPartResolver {
  @Query(() => [ImsInvPartView])
  @UseMiddleware(isAuth)
  async getAllImsInvPart(): Promise<ImsInvPartView[] | undefined> {
    try {
      return await ImsInvPartView.find();
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [ImsInvPartView])
  @UseMiddleware(isAuth)
  async getImsInvPartBySite(
    @Arg('contract', () => String) contract: string
  ): Promise<ImsInvPartView[] | undefined> {
    try {
      return await ImsInvPartView.findBy({ contract });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => String)
  @UseMiddleware(isAuth)
  async getImsInvPartDescription(
    @Arg('partNo', () => String) partNo: string,
    @Arg('contract', () => String) contract: string
  ): Promise<string | null> {
    try {
      const sql = `
        SELECT atj_ims_inv_part_api.get_description( :partNo, :contract) as "description"
        FROM   DUAL
      `;
      const result = await ifs.query(sql, [partNo, contract]);
      return result[0].description || ' ';
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => String)
  @UseMiddleware(isAuth)
  async getImsInvPartUom(
    @Arg('partNo', () => String) partNo: string,
    @Arg('contract', () => String) contract: string
  ): Promise<string | null> {
    try {
      const sql = `
        SELECT atj_ims_inv_part_api.get_unit_meas( :partNo, :contract) as "uom"
        FROM   DUAL
      `;
      const result = await ifs.query(sql, [partNo, contract]);
      return result[0].uom || ' ';
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => String)
  @UseMiddleware(isAuth)
  async getImsInvPartCatchUom(
    @Arg('partNo', () => String) partNo: string,
    @Arg('contract', () => String) contract: string
  ): Promise<string | null> {
    try {
      const sql = `
      SELECT atj_ims_inv_part_api.get_catch_unit_meas( :partNo, :contract) as "catchUom"
      FROM   DUAL
    `;
      const result = await ifs.query(sql, [partNo, contract]);
      return result[0].catchUom || ' ';
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
