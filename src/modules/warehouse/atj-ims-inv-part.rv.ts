import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Query, Resolver, UseMiddleware } from 'type-graphql';
import { ImsInvPart } from './entities/atj-ims-inv-part';
import { ImsInvPartView } from './entities/atj-ims-inv-part.vw';

@Resolver(ImsInvPart)
export class ImsInvPartResolver {
  @Query(() => [ImsInvPartView])
  @UseMiddleware(isAuth)
  async getAllImsPartNo(): Promise<ImsInvPartView[] | undefined> {
    try {
      return await ImsInvPartView.find();
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
