import { ifs } from '@/database/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { LockRequisition } from './entities/spt-lock-requisition';
import { LockRequisitionInput } from './spt-lock-requisition.in';

@Resolver(LockRequisition)
export class LockRequisitionResolver {
  @Query(() => [LockRequisition])
  @UseMiddleware(isAuth)
  async getAllLockRequisition(): Promise<LockRequisition[] | undefined> {
    try {
      return await LockRequisition.find();
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => LockRequisition, { nullable: true })
  @UseMiddleware(isAuth)
  async updateLockRequisition(
    @Arg('input') input: LockRequisitionInput
  ): Promise<LockRequisition | undefined> {
    try {
      const status = await LockRequisition.findBy({});
      if (!status) throw new Error('No data found.');
      const sql = `
    BEGIN
      GBR_SPT_API.UPDATE_LOCK_REQUISITION(:status);
    END;
  `;
      return await ifs.query(sql, [input.status]);
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
