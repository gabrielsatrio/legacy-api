import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { KontrolBakuBenangLine } from './entities/kontrol-baku-benang-line';
import { KontrolBakuBenangLineView } from './entities/kontrol-baku-benang-line.vw';
import { KontrolBakuBenangLineInput } from './kontrol-baku-benang-line.in';

@Resolver(KontrolBakuBenangLine)
export class KontrolBakuBenangLineResolver {
  @Query(() => [KontrolBakuBenangLine], { nullable: true })
  @UseMiddleware(isAuth)
  async getKontrolBakuBenangLine(
    @Arg('idKontrol', () => Number) idKontrol: number
  ): Promise<KontrolBakuBenangLine[] | undefined> {
    try {
      return await KontrolBakuBenangLine.findBy({
        idKontrol
      });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [KontrolBakuBenangLineView], { nullable: true })
  @UseMiddleware(isAuth)
  async getKontrolBakuBenangLineView(
    @Arg('idKontrol', () => Number) idKontrol: number
  ): Promise<KontrolBakuBenangLineView[] | undefined> {
    try {
      return await KontrolBakuBenangLineView.findBy({
        idKontrol
      });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => KontrolBakuBenangLine, { nullable: true })
  @UseMiddleware(isAuth)
  async updateKontrolBakuBenangLine(
    @Arg('input') input: KontrolBakuBenangLineInput
  ): Promise<KontrolBakuBenangLine | undefined> {
    try {
      const data = await KontrolBakuBenangLine.findOneBy({
        idKontrol: input.idKontrol,
        lineNo: input.lineNo
      });
      if (!data) throw new Error('No data found.');
      KontrolBakuBenangLine.merge(data, { ...input });
      const result = await KontrolBakuBenangLine.save(data);
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => KontrolBakuBenangLine)
  @UseMiddleware(isAuth)
  async deleteKontrolBakuBenangLine(
    @Arg('idKontrol') idKontrol: number,
    @Arg('lineNo') lineNo: number
  ): Promise<KontrolBakuBenangLine> {
    try {
      const data = await KontrolBakuBenangLine.findOneBy({ idKontrol, lineNo });
      if (!data) throw new Error('No data found.');
      await KontrolBakuBenangLine.delete({ idKontrol, lineNo });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
