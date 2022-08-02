import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Query, Resolver, UseMiddleware } from 'type-graphql';
import { DeptCodeCateringView } from './entities/dept-code-catering.vw';

@Resolver(DeptCodeCateringView)
export class DeptCodeCateringViewResolver {
  @Query(() => [DeptCodeCateringView], { nullable: true })
  @UseMiddleware(isAuth)
  async getDeptCode(): Promise<DeptCodeCateringView[] | undefined> {
    try {
      return await DeptCodeCateringView.find({
        order: { deptCode: 'ASC' }
      });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
