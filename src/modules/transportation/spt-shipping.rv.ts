import { ifs } from '@/database/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import oracledb from 'oracledb';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { Shipping } from './entities/spt-shipping';
import { ShippingInput } from './spt-shipping.in';

@Resolver(Shipping)
export class ShippingResolver {
  @Query(() => [Shipping])
  @UseMiddleware(isAuth)
  async getAllShippings(): Promise<Shipping[] | undefined> {
    return await Shipping.find();
  }

  @Query(() => Shipping, { nullable: true })
  @UseMiddleware(isAuth)
  async getShipping(
    @Arg('shippingId') shippingId: string
  ): Promise<Shipping | null> {
    return await Shipping.findOneBy({ shippingId });
  }

  @Query(() => Shipping, { nullable: true })
  @UseMiddleware(isAuth)
  async getTarif(
    @Arg('reqNo') reqNo: string,
    @Arg('expeditionId') expeditionId: string,
    @Arg('vehicleId') vehicleId: string,
    @Arg('isNormalPrice') isNormalPrice: string
  ): Promise<any | undefined> {
    try {
      const sql = `SELECT GBR_SPT_API.CALCULATE_TARIF(:reqNo, :expeditionId, :vehicleId, :isNormalPrice) as "tarif" FROM DUAL`;
      let tarif = await ifs.query(sql, [
        reqNo,
        expeditionId,
        vehicleId,
        isNormalPrice
      ]);
      tarif = tarif[0].tarif;
      return { rate: tarif };
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => Shipping)
  @UseMiddleware(isAuth)
  async createShipping(
    @Arg('input') input: ShippingInput
  ): Promise<Shipping | null> {
    try {
      const sql = `
    BEGIN
      GBR_SPT_API.Create_Shipping(:shippingId, :expeditionId, :vehicleId, :destinationId, :rate, :multidropRate, :outShippingId);
    END;
  `;
      const result = await ifs.query(sql, [
        input.shippingId,
        input.expeditionId,
        input.vehicleId,
        input.destinationId,
        input.rate,
        input.multidropRate,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING }
      ]);
      const outShippingId = result[0] as string;
      const data = Shipping.findOneBy({ shippingId: outShippingId });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => Shipping, { nullable: true })
  @UseMiddleware(isAuth)
  async updateShipping(
    @Arg('input') input: ShippingInput
  ): Promise<Shipping | null> {
    try {
      const shipping = await Shipping.findOneBy({
        shippingId: input.shippingId
      });
      if (!shipping) throw new Error('No data found.');
      const sql = `
      BEGIN
        GBR_SPT_API.UPDATE_SHIPPING(:shippingId, :expeditionId, :vehicleId, :destinationId, :rate, :multidropRate, :outShippingId);
      END;
    `;
      const result = await ifs.query(sql, [
        input.shippingId,
        input.expeditionId,
        input.vehicleId,
        input.destinationId,
        input.rate,
        input.multidropRate,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING }
      ]);
      const outShippingId = result[0];
      const data = Shipping.findOneBy({ shippingId: outShippingId });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => Shipping)
  @UseMiddleware(isAuth)
  async deleteShipping(
    @Arg('shippingId') shippingId: string
  ): Promise<Shipping> {
    try {
      const shipping = await Shipping.findOneBy({ shippingId });
      if (!shipping) throw new Error('No data found.');
      await Shipping.delete({ shippingId });
      return shipping;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
