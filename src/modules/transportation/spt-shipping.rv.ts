import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import oracledb from 'oracledb';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { getConnection } from 'typeorm';
import { Shipping } from './entities/spt-shipping';
import { ShippingInput } from './spt-shipping.in';

@Resolver(Shipping)
export class ShippingResolver {
  @Query(() => [Shipping])
  @UseMiddleware(isAuth)
  async getAllShippings(): // @Arg('contract', () => [String])
  // contract: string[],
  // @Ctx() { req }: Context
  Promise<Shipping[] | undefined> {
    return Shipping.find();
  }

  @Query(() => Shipping, { nullable: true })
  @UseMiddleware(isAuth)
  async getShipping(
    @Arg('shippingId') shippingId: string
  ): Promise<Shipping | undefined> {
    return await Shipping.findOne(shippingId);
  }

  @Query(() => Shipping, { nullable: true })
  @UseMiddleware(isAuth)
  async getTarif(
    @Arg('reqNo') reqNo: string,
    @Arg('expeditionId') expeditionId: string,
    @Arg('vehicleId') vehicleId: string,
    @Arg('isNormalPrice') isNormalPrice: string
  ): Promise<any | undefined> {
    let tarif;
    const sql = `SELECT GBR_SPT_API.CALCULATE_TARIF(:reqNo, :expeditionId, :vehicleId, :isNormalPrice) as TARIF FROM DUAL`;
    try {
      tarif = await getConnection().query(sql, [
        reqNo,
        expeditionId,
        vehicleId,
        isNormalPrice
      ]);
      tarif = tarif[0].TARIF;
      console.log('tarif', tarif);
    } catch (err) {
      throw new Error(mapError(err));
    }
    return { rate: tarif };
  }

  @Mutation(() => Shipping)
  @UseMiddleware(isAuth)
  async createShipping(
    @Arg('input') input: ShippingInput
    // @Ctx() { req }: Context
  ): Promise<Shipping | undefined> {
    let result;
    //const createdBy: string = req.session.userId;
    const sql = `
    BEGIN
      GBR_SPT_API.Create_Shipping(:shippingId, :expeditionId, :vehicleId, :destinationId, :rate, :multidropRate, :outShippingId);
    END;
  `;

    try {
      result = await getConnection().query(sql, [
        input.shippingId,
        input.expeditionId,
        input.vehicleId,
        input.destinationId,
        input.rate,
        input.multidropRate,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING }
      ]);
    } catch (err) {
      throw new Error(mapError(err));
    }
    const outShippingId = result[0] as string;
    const data = Shipping.findOne(outShippingId);
    return data;
  }

  @Mutation(() => Shipping, { nullable: true })
  @UseMiddleware(isAuth)
  async updateShipping(
    @Arg('input') input: ShippingInput
  ): Promise<Shipping | undefined> {
    let result;
    const shipping = await Shipping.findOne({ shippingId: input.shippingId });
    if (!shipping) {
      return undefined;
    }

    const sql = `
      BEGIN
        GBR_SPT_API.UPDATE_SHIPPING(:shippingId, :expeditionId, :vehicleId, :destinationId, :rate, :multidropRate, :outShippingId);
      END;
    `;
    try {
      result = await getConnection().query(sql, [
        input.shippingId,
        input.expeditionId,
        input.vehicleId,
        input.destinationId,
        input.rate,
        input.multidropRate,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING }
      ]);
    } catch (err) {
      throw new Error(mapError(err));
    }
    const outShippingId = result[0];
    const data = Shipping.findOne({
      shippingId: outShippingId
    });
    return data;
  }

  @Mutation(() => Shipping)
  @UseMiddleware(isAuth)
  async deleteShipping(
    @Arg('shippingId') shippingId: string
    //@Ctx() { req }: Context
  ): Promise<Shipping> {
    //const createdBy: string = req.session.userId;
    const shipping = await Shipping.findOne({
      shippingId
    });
    if (!shipping) throw new Error('No data found.');
    try {
      await Shipping.delete({ shippingId });
      return shipping;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
