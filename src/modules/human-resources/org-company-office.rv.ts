import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Query, Resolver, UseMiddleware } from 'type-graphql';
import { CompanyOfficeView } from './entities/org-company-office.vw';

@Resolver(CompanyOfficeView)
export class OrgCompanyOfficeViewResolver {
  @Query(() => [CompanyOfficeView])
  @UseMiddleware(isAuth)
  async getCompanyOffice(): Promise<CompanyOfficeView[] | undefined> {
    try {
      return await CompanyOfficeView.find();
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
