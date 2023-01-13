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

  @Query(() => [ImsInvPartInStockView])
  @UseMiddleware(isAuth)
  async getImsInvPartInStockByAllowedSite(
    @Arg('contract', () => [String]) contract: string[]
  ): Promise<ImsInvPartInStockView[] | undefined> {
    try {
      return await ImsInvPartInStockView.createQueryBuilder('A')
        .where('A.CONTRACT IN (:...contract)', { contract })
        .getMany();
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
                                                  :note,
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
        input.note,
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

  @Mutation(() => ImsInvPartInStock)
  @UseMiddleware(isAuth)
  async deleteImsInvPartInStock(
    @Arg('partNo', () => String) partNo: string,
    @Arg('contract', () => String) contract: string,
    @Arg('locationNo', () => String) locationNo: string,
    @Arg('lotBatchNo', () => String) lotBatchNo: string,
    @Arg('note', () => String) note: string,
    @Arg('modifiedDate', () => Date) modifiedDate: Date,
    @Arg('modifiedBy', () => String) modifiedBy: string
  ): Promise<ImsInvPartInStock | null> {
    try {
      const exist = await ImsInvPartInStockView.findOneBy({
        partNo,
        contract,
        locationNo,
        lotBatchNo
      });
      if (!exist) throw new Error('Data not exist');

      const sql = `
        BEGIN
          atj_ims_inv_part_in_stock_api.delete__( :partNo,
                                                  :contract,
                                                  :locationNo,
                                                  :lotBatchNo,
                                                  :note,
                                                  :modifiedDate,
                                                  :modifiedBy);
        END;
      `;
      await ifs.query(sql, [
        partNo,
        contract,
        locationNo,
        lotBatchNo,
        note,
        modifiedDate,
        modifiedBy
      ]);
      return await ImsInvPartInStock.findOneBy({
        partNo,
        contract,
        locationNo,
        lotBatchNo
      });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => ImsInvPartInStock)
  @UseMiddleware(isAuth)
  async issueImsInvPartInStock(
    @Arg('partNo', () => String) partNo: string,
    @Arg('contract', () => String) contract: string,
    @Arg('locationNo', () => String) locationNo: string,
    @Arg('lotBatchNo', () => String) lotBatchNo: string,
    @Arg('note', () => String) note: string,
    @Arg('modifiedDate', () => Date) modifiedDate: Date,
    @Arg('modifiedBy', () => String) modifiedBy: string
  ): Promise<ImsInvPartInStock | null> {
    try {
      const exist = await ImsInvPartInStockView.findOneBy({
        partNo,
        contract,
        locationNo,
        lotBatchNo
      });
      if (!exist) throw new Error('Data not exist');
      const sql = `
        BEGIN
          atj_ims_inv_part_in_stock_api.issue__(:partNo,
                                                :contract,
                                                :locationNo,
                                                :lotBatchNo,
                                                :note,
                                                :issueDate,
                                                :issueBy);
        END;
      `;
      await ifs.query(sql, [
        partNo,
        contract,
        locationNo,
        lotBatchNo,
        note,
        modifiedDate,
        modifiedBy
      ]);
      return await ImsInvPartInStock.findOneBy({
        partNo,
        contract,
        locationNo,
        lotBatchNo
      });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => ImsInvPartInStock)
  @UseMiddleware(isAuth)
  async unissueImsInvPartInStock(
    @Arg('partNo', () => String) partNo: string,
    @Arg('contract', () => String) contract: string,
    @Arg('locationNo', () => String) locationNo: string,
    @Arg('lotBatchNo', () => String) lotBatchNo: string,
    @Arg('note', () => String) note: string,
    @Arg('modifiedDate', () => Date) modifiedDate: Date,
    @Arg('modifiedBy', () => String) modifiedBy: string
  ): Promise<ImsInvPartInStock | null> {
    try {
      const exist = await ImsInvPartInStockView.findOneBy({
        partNo,
        contract,
        locationNo,
        lotBatchNo
      });
      if (!exist) throw new Error('Data not exist');
      const sql = `
        BEGIN
          atj_ims_inv_part_in_stock_api.unissue__(:partNo,
                                                  :contract,
                                                  :locationNo,
                                                  :lotBatchNo,
                                                  :note,
                                                  :unissueDate,
                                                  :unissueBy);
        END;
      `;
      await ifs.query(sql, [
        partNo,
        contract,
        locationNo,
        lotBatchNo,
        note,
        modifiedDate,
        modifiedBy
      ]);
      return await ImsInvPartInStock.findOneBy({
        partNo,
        contract,
        locationNo,
        lotBatchNo
      });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
