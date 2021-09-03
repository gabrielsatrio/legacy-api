import { isAuth } from '@/middlewares/is-auth';
import axios from 'axios';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { In } from 'typeorm';
import { MapTimbangan } from './entities/ddp-map-timbangan';

@Resolver(MapTimbangan)
export class ShopOrderResolver {
  @Query(() => String, { nullable: true })
  @UseMiddleware(isAuth)
  async getMapTimbang(
    @Arg('contract', () => [String]) contract: string[],
    @Arg('userName') userName: string,
    @Arg('jenisTimbang') jenisTimbang: string
  ): Promise<string | undefined> {
    const path = await MapTimbangan.find({
      contract: In(contract),
      userName,
      jenisTimbang
    });

    const res = await axios.get(path[0].address);

    return res.data.toString();
  }
}
