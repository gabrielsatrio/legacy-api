import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { DeptCateringView } from './entities/dept-catering.vw';

@Resolver(DeptCateringView)
export class DeptCateringViewResolver {
  @Query(() => [DeptCateringView])
  @UseMiddleware(isAuth)
  async getDeptCatering(): Promise<DeptCateringView[] | undefined> {
    try {
      return await DeptCateringView.find({
        order: { deptCode: 'ASC' }
      });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [DeptCateringView], { nullable: true })
  @UseMiddleware(isAuth)
  async getDeptName(
    @Arg('deptCode') deptCode: string
  ): Promise<DeptCateringView[] | undefined> {
    try {
      return await DeptCateringView.findBy({ deptCode });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
