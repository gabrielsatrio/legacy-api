import { isAuth } from '@/middlewares/is-auth';
import { Query, Resolver, UseMiddleware } from 'type-graphql';
import { IfsConditionCodeView } from './entities/ifs-condition-code.vw';

@Resolver(IfsConditionCodeView)
export class IfsConditionCodeResolver {
  @Query(() => [IfsConditionCodeView], { nullable: true })
  @UseMiddleware(isAuth)
  async getConditionCodes(): Promise<IfsConditionCodeView[] | undefined> {
    return await IfsConditionCodeView.find({ order: { conditionCode: 'ASC' } });
  }
}
