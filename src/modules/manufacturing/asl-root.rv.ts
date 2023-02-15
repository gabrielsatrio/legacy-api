import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { AslRootView } from './entities/asl-root.vw';

@Resolver(AslRootView)
export class AslRootResolver {
  @Query(() => AslRootView, { nullable: true })
  @UseMiddleware(isAuth)
  async getAslRoot(@Arg('menuId') menuId: string): Promise<AslRootView | null> {
    try {
      return await AslRootView.findOneBy({ menuId });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [AslRootView], { nullable: true })
  @UseMiddleware(isAuth)
  async getAllAslRoot(): Promise<AslRootView[] | null> {
    try {
      return await AslRootView.find();
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
  @Query(() => [AslRootView], { nullable: true })
  @UseMiddleware(isAuth)
  async getAslRootByPlatformCategory(
    @Arg('platform') platform: string,
    @Arg('category') category: string
  ): Promise<AslRootView[] | null> {
    try {
      return await AslRootView.findBy({ platform, category });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
