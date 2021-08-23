import { isAuth } from '@/middlewares/is-auth';
import { setErrors } from '@/utils/set-errors';
import oracledb from 'oracledb';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { getConnection } from 'typeorm';
import { Destination } from './entities/spt-destination';
import { DestinationResponse } from './spt-destination.dr';
import { DestinationInput } from './spt-destination.in';

@Resolver(Destination)
export class DestinationResolver {
  @Query(() => [Destination])
  @UseMiddleware(isAuth)
  async getAllDestinations(): Promise<Destination[] | undefined> {
    return Destination.find();
  }

  @Query(() => Destination, { nullable: true })
  @UseMiddleware(isAuth)
  async getDestination(
    @Arg('destinationId') destinationId: string
  ): Promise<Destination | undefined> {
    return await Destination.findOne(destinationId);
  }

  @Mutation(() => DestinationResponse)
  @UseMiddleware(isAuth)
  async createDestination(
    @Arg('input') input: DestinationInput
  ): Promise<DestinationResponse | undefined> {
    let result;
    //const createdBy: string = req.session.userId;
    const sql = `
    BEGIN
      GBR_SPT_API.Create_Destination(:destinationId, :destinationName, :outDestinationId);
    END;
  `;
    try {
      result = await getConnection().query(sql, [
        input.destinationId,
        input.destinationName,
        //createdBy
        { dir: oracledb.BIND_OUT, type: oracledb.STRING }
      ]);
    } catch (err) {
      return setErrors(err.message);
    }
    const outDestinationId = result[0] as string;
    const data = Destination.findOne({
      destinationId: outDestinationId
    });
    return { success: true, data };
  }

  @Mutation(() => DestinationResponse, { nullable: true })
  @UseMiddleware(isAuth)
  async updateDestination(
    @Arg('input') input: DestinationInput
  ): Promise<DestinationResponse | undefined> {
    let result;
    const destination = await Destination.findOne({
      destinationId: input.destinationId
    });
    if (!destination) {
      return undefined;
    }
    const sql = `
    BEGIN
      GBR_SPT_API.Update_Destination(:destinationId, :destinationName,  :outDestinationId);
    END;
  `;
    try {
      result = await getConnection().query(sql, [
        input.destinationId,
        input.destinationName,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING }
      ]);
    } catch (err) {
      return setErrors(err.message);
    }
    const outDestinationId = result[0];
    const data = Destination.findOne({
      destinationId: outDestinationId
    });
    return { success: true, data };
  }

  @Mutation(() => DestinationResponse)
  @UseMiddleware(isAuth)
  async deleteDestination(
    @Arg('destinationId') destinationId: string
  ): Promise<DestinationResponse> {
    //const createdBy: string = req.session.userId;
    const destination = await Destination.findOne({
      destinationId
    });
    if (!destination) return setErrors('No data found.');
    try {
      await Destination.delete({ destinationId });
      return { success: true };
    } catch (err) {
      return setErrors(err.message);
    }
  }
}
