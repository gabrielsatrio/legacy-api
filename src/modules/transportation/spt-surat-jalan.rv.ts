import { ifs } from '@/database/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import oracledb from 'oracledb';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { In } from 'typeorm';
import { SuratJalan } from './entities/spt-surat-jalan';
import { SuratJalanInput } from './spt-surat-jalan.in';

@Resolver(SuratJalan)
export class SuratJalanResolver {
  @Query(() => [SuratJalan])
  @UseMiddleware(isAuth)
  async getAllSuratJalan(
    @Arg('contract', () => [String])
    contract: string[]
  ): Promise<SuratJalan[] | undefined> {
    try {
      return await SuratJalan.find({ where: { contract: In(contract) } });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => SuratJalan, { nullable: true })
  @UseMiddleware(isAuth)
  async updateSuratJalan(
    @Arg('input') input: SuratJalanInput
  ): Promise<SuratJalan | null> {
    try {
      const suratJalan = await SuratJalan.findOneBy({ reqNo: input.reqNo });
      if (!suratJalan) throw new Error('No data found');
      const sql = `
      BEGIN
        GBR_SPT_API.UPDATE_SURAT_JALAN(:reqNo, :rollQty, :meter, :weight, :volume, :notes, :licensePlate, :nopolLangsir, :driverName, :outReqNo);
      END;
    `;
      const result = await ifs.query(sql, [
        input.reqNo,
        input.rollQty,
        input.meter,
        input.weight,
        input.volume,
        input.notes,
        input.licensePlate,
        input.nopolLangsir,
        input.driverName,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING }
      ]);
      const outReqNo = result[0];
      const data = SuratJalan.findOneBy({ reqNo: outReqNo });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
