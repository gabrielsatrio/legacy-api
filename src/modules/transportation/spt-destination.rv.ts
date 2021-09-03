import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import oracledb from 'oracledb';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { getConnection } from 'typeorm';
import { Destination } from './entities/spt-destination';
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

  @Mutation(() => Destination)
  @UseMiddleware(isAuth)
  async createDestination(
    @Arg('input') input: DestinationInput
  ): Promise<Destination | undefined> {
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
      throw new Error(mapError(err));
    }
    const outDestinationId = result[0] as string;
    const data = Destination.findOne({
      destinationId: outDestinationId
    });
    return data;
  }

  @Mutation(() => Destination, { nullable: true })
  @UseMiddleware(isAuth)
  async updateDestination(
    @Arg('input') input: DestinationInput
  ): Promise<Destination | undefined> {
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
      throw new Error(mapError(err));
    }
    const outDestinationId = result[0];
    const data = Destination.findOne({
      destinationId: outDestinationId
    });
    return data;
  }

  @Mutation(() => Destination)
  @UseMiddleware(isAuth)
  async deleteDestination(
    @Arg('destinationId') destinationId: string
  ): Promise<Destination> {
    //const createdBy: string = req.session.userId;
    const destination = await Destination.findOne({
      destinationId
    });
    if (!destination) throw new Error('No data found.');
    try {
      await Destination.delete({ destinationId });
      return destination;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
