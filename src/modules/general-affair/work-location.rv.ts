import { isAuth } from '@/middlewares/is-auth';
import { Query, Resolver, UseMiddleware } from 'type-graphql';
import { WorkLocationView } from './entities/work-location.vw';

@Resolver(WorkLocationView)
export class WorkLocationViewResolver {
  @Query(() => [WorkLocationView], { nullable: true })
  @UseMiddleware(isAuth)
  async getWorkLocation(): Promise<WorkLocationView[] | undefined> {
    return await WorkLocationView.find({
      order: { workLocation: 'ASC' }
    });
  }
}
