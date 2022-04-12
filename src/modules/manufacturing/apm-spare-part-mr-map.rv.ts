import { ifs } from '@/config/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { SparePartMrMapPkInput } from './apm-spare-part-mr-map-pk.in';
import { SparePartMrMapSyncInput } from './apm-spare-part-mr-map-sync.in';
import { SparePartMrMapView } from './entities/apm-spare-part-mr-map.vw';

@Resolver(SparePartMrMapView)
export class SparePartMrMapResolver {
  @Query(() => SparePartMrMapView, { nullable: true })
  @UseMiddleware(isAuth)
  async getSparePartMrMap(
    @Arg('input') input: SparePartMrMapPkInput
  ): Promise<SparePartMrMapView | undefined | null> {
    return await SparePartMrMapView.findOneBy({ ...input });
  }

  @Query(() => [SparePartMrMapView])
  @UseMiddleware(isAuth)
  async getSparePartMrMapByWorkCenterNo(
    @Arg('contract') contract: string,
    @Arg('workCenterNo') workCenterNo: string
  ): Promise<SparePartMrMapView[] | undefined> {
    return await SparePartMrMapView.findBy({ contract, workCenterNo });
  }

  @Mutation(() => SparePartMrMapView)
  @UseMiddleware(isAuth)
  async syncSparePartMrMap(
    @Arg('input') input: SparePartMrMapSyncInput
  ): Promise<SparePartMrMapView | null> {
    try {
      const sql = `
        BEGIN
          ROB_APM_MR_SparePart_Map_API.Sync__(
            :contract,
            :orderNo,
            :lineNo,
            :releaseNo,
            :lineItemNo,
            :orderClass,
            :machineId,
            :partNo,
            :quantity,
            :newMachineId,
            :newQuantity
          );
        EXCEPTION
          WHEN OTHERS THEN
            ROLLBACK;
            RAISE;
        END;
      `;
      await ifs.query(sql, [
        input.contract,
        input.orderNo,
        input.lineNo,
        input.releaseNo,
        input.lineItemNo,
        input.orderClass,
        input.machineId,
        input.partNo,
        input.quantity,
        input.newMachineId,
        input.newQuantity
      ]);
      const result = await SparePartMrMapView.findOneBy({
        contract: input.contract,
        orderNo: input.orderNo,
        lineNo: input.lineNo,
        releaseNo: input.releaseNo,
        lineItemNo: input.lineItemNo,
        orderClass: input.orderClass,
        machineId: input.newMachineId
      });
      return result;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
