import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Query, Resolver, UseMiddleware } from 'type-graphql';
import { PartCodeView } from './entities/part-code.vw';

@Resolver(PartCodeView)
export class PartCodeViewResolver {
  @Query(() => [PartCodeView])
  @UseMiddleware(isAuth)
  async getAllPartCode(): Promise<PartCodeView[] | undefined> {
    try {
      return await PartCodeView.find();
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
