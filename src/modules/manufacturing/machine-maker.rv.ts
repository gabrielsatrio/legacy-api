import { isAuth } from '@/middlewares/is-auth';
import { Query, Resolver, UseMiddleware } from 'type-graphql';
import { MachineMakerView } from './entities/machine-maker.vw';

@Resolver(MachineMakerView)
export class MachineMakerResolver {
  @Query(() => [MachineMakerView])
  @UseMiddleware(isAuth)
  async getAllMachineMakers(): Promise<MachineMakerView[] | undefined> {
    return await MachineMakerView.find({
      where: { partCode: 'SA' },
      order: { makerId: 'ASC' }
    });
  }
}
