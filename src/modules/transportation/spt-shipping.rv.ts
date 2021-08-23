import { isAuth } from '@/middlewares/is-auth';
import { setErrors } from '@/utils/set-errors';
import oracledb from 'oracledb';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { getConnection } from 'typeorm';
import { Shipping } from './entities/spt-shipping';
import { ShippingResponse } from './spt-shipping.dr';
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

  @Mutation(() => ShippingResponse)
  @UseMiddleware(isAuth)
  async createShipping(
    @Arg('input') input: ShippingInput
    // @Ctx() { req }: Context
  ): Promise<ShippingResponse | undefined> {
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
      return setErrors(err.message);
    }
    const outShippingId = result[0] as string;
    const data = Shipping.findOne(outShippingId);
    return { success: true, data };
  }

  @Mutation(() => ShippingResponse, { nullable: true })
  @UseMiddleware(isAuth)
  async updateShipping(
    @Arg('input') input: ShippingInput
  ): Promise<ShippingResponse | undefined> {
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
      return setErrors(err.message);
    }
    const outShippingId = result[0];
    const data = Shipping.findOne({
      shippingId: outShippingId
    });
    return { success: true, data };
  }

  @Mutation(() => ShippingResponse)
  @UseMiddleware(isAuth)
  async deleteShipping(
    @Arg('shippingId') shippingId: string
    //@Ctx() { req }: Context
  ): Promise<ShippingResponse> {
    //const createdBy: string = req.session.userId;
    const shipping = await Shipping.findOne({
      shippingId
    });
    if (!shipping) return setErrors('No data found.');
    try {
      await Shipping.delete({ shippingId });
      return { success: true };
    } catch (err) {
      return setErrors(err.message);
    }
  }
}
