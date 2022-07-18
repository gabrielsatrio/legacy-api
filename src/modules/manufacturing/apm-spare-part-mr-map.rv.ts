import { ifs } from '@/database/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { Like } from 'typeorm';
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
    try {
      return await SparePartMrMapView.findOneBy({ ...input });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Query(() => [SparePartMrMapView])
  @UseMiddleware(isAuth)
  async getSparePartMrMapByDeptWorkCenterNo(
    @Arg('contract') contract: string,
    @Arg('departmentId') departmentId: string,
    @Arg('workCenterNo') workCenterNo: string,
    @Arg('includeAssigned', { defaultValue: true, nullable: true })
    includeAssigned: boolean
  ): Promise<SparePartMrMapView[] | undefined> {
    try {
      let result;
      if (departmentId === '%') {
        result = await SparePartMrMapView.findBy({
          contract,
          workCenterNo: Like(workCenterNo)
        });
      } else {
        result = await SparePartMrMapView.findBy({
          contract,
          departmentId,
          workCenterNo: Like(workCenterNo)
        });
      }
      let filteredResult = result;
      if (!includeAssigned) {
        filteredResult = result.filter(
          (data) => data.maintenanceDescription === null
        );
      }
      return filteredResult;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => SparePartMrMapView, { nullable: true })
  @UseMiddleware(isAuth)
  async deleteSparePartMrMap(
    @Arg('input') input: SparePartMrMapPkInput
  ): Promise<SparePartMrMapView | null> {
    try {
      const data = await SparePartMrMapView.findOneBy({ ...input });
      if (!data) return null;
      const sql = `
        BEGIN
          DELETE FROM ROB_APM_MR_Sparepart_Map
          WHERE  order_no = :orderNo
          AND    line_no = :lineNo
          AND    release_no = :releaseNo
          AND    line_item_no = :lineItemNo
          AND    order_class = :orderClass
          AND    machine_id = :machineId;
        EXCEPTION
          WHEN OTHERS THEN
            ROLLBACK;
            RAISE;
        END;
      `;
      await ifs.query(sql, [
        input.orderNo,
        input.lineNo,
        input.releaseNo,
        input.lineItemNo,
        input.orderClass,
        input.machineId
      ]);
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
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
