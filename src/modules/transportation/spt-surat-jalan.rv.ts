import { isAuth } from '@/middlewares/is-auth';
import { Query, Resolver, UseMiddleware } from 'type-graphql';
import { SuratJalan } from './entities/spt-surat-jalan';

@Resolver(SuratJalan)
export class SuratJalanResolver {
  @Query(() => [SuratJalan])
  @UseMiddleware(isAuth)
  async getAllSuratJalan(): Promise<SuratJalan[] | undefined> {
    return SuratJalan.find();
  }

  // @Query(() => SuratJalan, { nullable: true })
  // @UseMiddleware(isAuth)
  // async getSuratJalan(
  //   @Arg('assignId') assignId: string
  // ): Promise<AssignView | undefined> {
  //   return await AssignView.findOne(assignId);
  // }
}
