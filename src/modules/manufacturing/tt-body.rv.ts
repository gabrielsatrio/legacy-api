import { ifs } from '@/database/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Mutation, Resolver, UseMiddleware } from 'type-graphql';
import { TransportTaskBody } from './entities/tt-detail';

@Resolver(TransportTaskBody)
export class TTBodyResolver {
  @Mutation(() => TransportTaskBody)
  @UseMiddleware(isAuth)
  async deleteTTLine(
    @Arg('transportTaskId') transportTaskId: string,
    @Arg('lotBatchNo') lotBatchNo: string
  ): Promise<TransportTaskBody> {
    try {
      const ttLine = await TransportTaskBody.findOneBy({
        transportTaskId,
        lotBatchNo
      });

      if (!ttLine) {
        throw new Error('No data found.');
      }

      const sql = `
      BEGIN
      ATJ_TRANSPORT_TASK_API.delete_line_tt(
        :transportTaskId,
        :lotBatchNo);
      END;
    `;

      await ifs.query(sql, [transportTaskId, lotBatchNo]);

      return ttLine;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
