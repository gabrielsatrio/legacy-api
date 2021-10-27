import { isAuth } from '@/middlewares/is-auth';
import { Query, Resolver, UseMiddleware } from 'type-graphql';
import { ConditionCodeView } from './entities/ifs-condition-code.vw';

@Resolver(ConditionCodeView)
export class ConditionCodeResolver {
  @Query(() => [ConditionCodeView], { nullable: true })
  @UseMiddleware(isAuth)
  async getAllConditionCodes(): Promise<ConditionCodeView[] | undefined> {
    return await ConditionCodeView.find({ order: { conditionCode: 'ASC' } });
  }
}
