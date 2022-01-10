import { isAuth } from '@/middlewares/is-auth';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { MachineCategory } from './entities/apm-machine-category';
import { MachineCategoryView } from './entities/apm-machine-category.vw';

@Resolver(MachineCategory)
export class MachineCategoryResolver {
  @Query(() => [MachineCategoryView])
  @UseMiddleware(isAuth)
  async getAllMachCategories(): Promise<MachineCategoryView[] | undefined> {
    return await MachineCategoryView.find();
  }

  @Query(() => MachineCategoryView, { nullable: true })
  @UseMiddleware(isAuth)
  async getMachCategory(
    @Arg('categoryId') categoryId: string
  ): Promise<MachineCategoryView | undefined> {
    return await MachineCategoryView.findOne({ categoryId });
  }
}
