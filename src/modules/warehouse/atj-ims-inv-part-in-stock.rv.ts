import { ifs } from '@/database/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { ImsInvPartInStockInput } from './atj-ims-inv-part-in-stock.in';
import { ImsInvPartInStock } from './entities/atj-ims-inv-part-in-stock';
import { ImsInvPartInStockView } from './entities/atj-ims-inv-part-in-stock.vw';

@Resolver(ImsInvPartInStock)
export class InventoryPartInStockResolver {
  @Query(() => [ImsInvPartInStockView])
  @UseMiddleware(isAuth)
  async getAllImsInvPartInStock(): Promise<
    ImsInvPartInStockView[] | undefined
  > {
    try {
      return await ImsInvPartInStockView.find();
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => ImsInvPartInStock)
  @UseMiddleware(isAuth)
  async createImsInvPartInStock(
    @Arg('input') input: ImsInvPartInStockInput
  ): Promise<ImsInvPartInStock | null> {
    try {
      const exist = await ImsInvPartInStock.findOneBy({
        partNo: input.partNo,
        contract: input.contract,
        locationNo: input.locationNo,
        lotBatchNo: input.locationNo
      });
      if (exist) throw new Error('Data already exist');
      const sql = `
      BEGIN
        atj_ims_inv_part_in_stock_api.insert__( :partNo,
                                                :contract,
                                                :locationNo,
                                                :lotBatch,
                                                :qtyOnhand,
                                                :catchQtyOnhand,
                                                :ctmNote,
                                                :createdDate,
                                                :createdBy);
      END;
      `;
      await ifs.query(sql, [
        input.partNo,
        input.contract,
        input.locationNo,
        input.lotBatchNo,
        input.qtyOnhand,
        input.catchQtyOnhand,
        input.ctmNote,
        input.createdDate,
        input.createdBy
      ]);
      return await ImsInvPartInStock.findOneBy({
        partNo: input.partNo,
        contract: input.contract,
        locationNo: input.locationNo,
        lotBatchNo: input.lotBatchNo
      });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
