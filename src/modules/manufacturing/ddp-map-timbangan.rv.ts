import { isAuth } from '@/middlewares/is-auth';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { In } from 'typeorm';
import { MapTimbangan } from './entities/ddp-map-timbangan';

@Resolver(MapTimbangan)
export class ShopOrderResolver {
  @Query(() => [MapTimbangan], { nullable: true })
  @UseMiddleware(isAuth)
  async getMapTimbang(
    @Arg('contract', () => [String]) contract: string[],
    @Arg('userName') userName: string,
    @Arg('jenisTimbang') jenisTimbang: string
  ): Promise<MapTimbangan[] | undefined> {
    return await MapTimbangan.find({
      contract: In(contract),
      userName,
      jenisTimbang
    });
  }
}
