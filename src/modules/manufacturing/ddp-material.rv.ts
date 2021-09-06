import { isAuth } from '@/middlewares/is-auth';
import oracledb from 'oracledb';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { getConnection, In } from 'typeorm';
import { mapError } from '../../utils/map-error';
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
  ): Promise<Material | undefined> {
    return await Material.findOne({
      contract: In(contract),
      orderNo
    });
  }

  @Mutation(() => Material)
  @UseMiddleware(isAuth)
  async createMaterial(
    @Arg('input') input: MaterialInput
  ): Promise<Material | undefined> {
    const sql = `
    BEGIN
       CHR_DDP_API.CREATE_MATERIAL(:contract,
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
      :outContract, :outIdNo);
    END;
  `;

    let result;

    try {
      result = await getConnection().query(sql, [
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
        { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        { dir: oracledb.BIND_OUT, type: oracledb.STRING }
      ]);
    } catch (err) {
      throw new Error(mapError(err));
    }
    const outContract = result[0] as string;
    const outIdNo = result[1] as string;

    const data = Material.findOne({ contract: outContract, idNo: outIdNo });
    return data;
  }

  @Mutation(() => Material)
  @UseMiddleware(isAuth)
  async UpdateMaterial(
    @Arg('input') input: MaterialInput
  ): Promise<Material | undefined> {
    const material = await Material.findOne({
      contract: input.contract,
      idNo: input.idNo
    });

    if (!material) {
      throw new Error('No data found.');
    }

    const sql = `
      BEGIN
      CHR_DDP_API.UPDATE_MATERIAL(:contract,
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
      :outContract, :outIdNo);
      END;
    `;
    let result;
    try {
      result = await getConnection().query(sql, [
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
        { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        { dir: oracledb.BIND_OUT, type: oracledb.STRING }
      ]);
    } catch (err) {
      throw new Error(mapError(err));
    }
    const outContract = result[0] as string;
    const outIdNo = result[1] as string;

    const data = Material.findOne({ contract: outContract, idNo: outIdNo });
    return data;
  }

  @Mutation(() => Material)
  @UseMiddleware(isAuth)
  async deleteMaterial(
    @Arg('contract') contract: string,
    @Arg('idNo') idNo: string
  ): Promise<Material> {
    try {
      const material = await Material.findOne({
        contract,
        idNo
      });

      if (!material) {
        throw new Error('No data found.');
      }

      await Material.delete({ contract, idNo });
      return material;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
