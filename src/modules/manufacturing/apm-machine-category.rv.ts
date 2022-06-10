import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { MachineCategory } from './entities/apm-machine-category';
import { MachineCategoryView } from './entities/apm-machine-category.vw';

@Resolver(MachineCategory)
export class MachineCategoryResolver {
  @Query(() => [MachineCategoryView])
  @UseMiddleware(isAuth)
  async getAllMachCategories(): Promise<MachineCategoryView[] | undefined> {
    try {
      return await MachineCategoryView.find({
        order: { description: 'ASC' }
      });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => MachineCategoryView, { nullable: true })
  @UseMiddleware(isAuth)
  async getMachCategory(
    @Arg('categoryId') categoryId: string
  ): Promise<MachineCategoryView | null> {
    try {
      return await MachineCategoryView.findOneBy({ categoryId });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
