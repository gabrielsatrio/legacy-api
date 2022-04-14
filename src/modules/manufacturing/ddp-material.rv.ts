import { ifs } from '@/database/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import oracledb from 'oracledb';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { In } from 'typeorm';
import { MaterialInput } from './ddp-material.in';
import { Material } from './entities/ddp-material';

@Resolver(Material)
export class MaterialResolver {
  @Query(() => [Material], { nullable: true })
  @UseMiddleware(isAuth)
  async getMaterials(
    @Arg('contract', () => [String])
    contract: string[]
  ): Promise<Material[] | undefined> {
    return await Material.createQueryBuilder('M')
      .leftJoinAndSelect('M.materialUses', 'material')
      .where('M.CONTRACT IN(:...contract)', {
        contract: contract
      })
      .getMany();
  }

  @Query(() => [Material], { nullable: true })
  @UseMiddleware(isAuth)
  async getMaterialById(
    @Arg('contract', () => [String]) contract: string[],
    @Arg('idNo') idNo: string
  ): Promise<Material[] | undefined> {
    return await Material.createQueryBuilder('M')
      .leftJoinAndSelect('M.materialUses', 'material')
      .where('M.CONTRACT IN(:...contract)', {
        contract: contract
      })
      .andWhere('M.ID_NO = :idNo', { idNo: idNo })
      .getMany();
  }

  @Query(() => Material, { nullable: true })
  @UseMiddleware(isAuth)
  async getMaterialByOrderNo(
    @Arg('contract', () => [String]) contract: string[],
    @Arg('orderNo') orderNo: string
  ): Promise<Material | null> {
    return await Material.findOneBy({
      contract: In(contract),
      orderNo
    });
  }

  @Mutation(() => Material)
  @UseMiddleware(isAuth)
  async createMaterial(
    @Arg('input') input: MaterialInput
  ): Promise<Material | null> {
    const sql = `
    BEGIN
    CHR_DDT_MATERIAL_API.CREATE_MATERIAL(:contract,
        :jenisCelup,
        :idNo,
        :tanggal,
        :partNo,
        :mediaCelup,
        :hasilCounterMeter,
        :orderNo,
        :noMesin,
        :jmlMediaCelup,
        :tara,
        :bruto,
        :netto,
        :note,
        :lotCelup,
        :tara2,
        :bruto2,
        :netto2,
        :mediaCelup2,
        :jmlMediaCelup2,
        :lotBahan,
      :outContract, :outIdNo);
    END;
  `;

    let result;

    try {
      result = await ifs.query(sql, [
        input.contract,
        input.jenisCelup,
        input.idNo,
        input.tanggal,
        input.partNo,
        input.mediaCelup,
        input.hasilCounterMeter,
        input.orderNo,
        input.noMesin,
        input.jmlMediaCelup,
        input.tara,
        input.bruto,
        input.netto,
        input.note,
        input.lotCelup,
        input.tara2,
        input.bruto2,
        input.netto2,
        input.mediaCelup2,
        input.jmlMediaCelup2,
        input.lotBahan,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        { dir: oracledb.BIND_OUT, type: oracledb.STRING }
      ]);
    } catch (err) {
      throw new Error(mapError(err));
    }
    const outContract = result[0] as string;
    const outIdNo = result[1] as string;

    const data = Material.findOneBy({ contract: outContract, idNo: outIdNo });
    return data;
  }

  @Mutation(() => Material)
  @UseMiddleware(isAuth)
  async UpdateMaterial(
    @Arg('input') input: MaterialInput
  ): Promise<Material | null> {
    const material = await Material.findOneBy({
      contract: input.contract,
      idNo: input.idNo
    });

    if (!material) {
      throw new Error('No data found.');
    }

    const sql = `
      BEGIN
      CHR_DDT_MATERIAL_API.UPDATE_MATERIAL(:contract,
        :jenisCelup,
        :idNo,
        :tanggal,
        :partNo,
        :mediaCelup,
        :hasilCounterMeter,
        :orderNo,
        :noMesin,
        :jmlMediaCelup,
        :tara,
        :bruto,
        :netto,
        :note,
        :lotCelup,
        :tara2,
        :bruto2,
        :netto2,
        :mediaCelup2,
        :jmlMediaCelup2,
        :lotBahan,
      :outContract, :outIdNo);
      END;
    `;
    let result;
    try {
      result = await ifs.query(sql, [
        input.contract,
        input.jenisCelup,
        input.idNo,
        input.tanggal,
        input.partNo,
        input.mediaCelup,
        input.hasilCounterMeter,
        input.orderNo,
        input.noMesin,
        input.jmlMediaCelup,
        input.tara,
        input.bruto,
        input.netto,
        input.note,
        input.lotCelup,
        input.tara2,
        input.bruto2,
        input.netto2,
        input.mediaCelup2,
        input.jmlMediaCelup2,
        input.lotBahan,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        { dir: oracledb.BIND_OUT, type: oracledb.STRING }
      ]);
    } catch (err) {
      throw new Error(mapError(err));
    }
    const outContract = result[0] as string;
    const outIdNo = result[1] as string;

    const data = Material.findOneBy({ contract: outContract, idNo: outIdNo });
    return data;
  }

  @Mutation(() => Material)
  @UseMiddleware(isAuth)
  async deleteMaterial(
    @Arg('contract') contract: string,
    @Arg('idNo') idNo: string
  ): Promise<Material> {
    try {
      const material = await Material.findOneBy({
        contract,
        idNo
      });

      if (!material) {
        throw new Error('No data found.');
      }

      const sql = `
      BEGIN
      CHR_DDT_MATERIAL_API.DELETE_MATERIAL(:contract, :idNo);
      END;
     `;

      await ifs.query(sql, [contract, idNo]);
      return material;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
