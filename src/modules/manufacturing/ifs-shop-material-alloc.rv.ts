import { isAuth } from '@/middlewares/is-auth';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { In } from 'typeorm';
import { IfsShopMaterialAllocView } from './entities/ifs-shop-material-alloc.vw';

@Resolver(IfsShopMaterialAllocView)
export class IfsShopMaterialAllocResolver {
  @Query(() => [IfsShopMaterialAllocView], { nullable: true })
  @UseMiddleware(isAuth)
  async getShopMaterialAlloc(
    @Arg('contract', () => [String]) contract: string[],
    @Arg('orderNo') orderNo: string,
    @Arg('partNo') partNo: string
  ): Promise<IfsShopMaterialAllocView[] | undefined> {
    return await IfsShopMaterialAllocView.findBy({
      contract: In(contract),
      orderNo,
      partNo
    });
  }
}
