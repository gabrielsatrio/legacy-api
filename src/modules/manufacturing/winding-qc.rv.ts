import { isAuth } from '@/middlewares/is-auth';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { In } from 'typeorm';
import { WindingQC } from './entities/winding-qc';

@Resolver(WindingQC)
export class WindingQCResolver {
  @Query(() => [WindingQC], { nullable: true })
  @UseMiddleware(isAuth)
  async getWindingQC(
    @Arg('contract', () => [String]) contract: string[]
  ): Promise<WindingQC[] | undefined> {
    return await WindingQC.find({
      contract: In(contract)
    });
  }
}
