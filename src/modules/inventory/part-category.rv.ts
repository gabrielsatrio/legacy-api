import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Query, Resolver, UseMiddleware } from 'type-graphql';
import { PartCategoryView } from './entities/part-category.vw';

@Resolver(PartCategoryView)
export class PartCategoryViewResolver {
  @Query(() => [PartCategoryView])
  @UseMiddleware(isAuth)
  async getPartCategories(): Promise<PartCategoryView[] | undefined> {
    try {
      return await PartCategoryView.find();
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
