import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Query, Resolver, UseMiddleware } from 'type-graphql';
import { DefectList } from './entities/ddp-defect-list';

@Resolver(DefectList)
export class DefectListResolver {
  @Query(() => [DefectList], { nullable: true })
  @UseMiddleware(isAuth)
  async getAllDefectList(): Promise<DefectList[] | undefined> {
    try {
      return await DefectList.find();
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
