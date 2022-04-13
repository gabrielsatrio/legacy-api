import { ifs } from '@/config/data-sources';
import { isAuth } from '@/middlewares/is-auth';
import { mapError } from '@/utils/map-error';
import oracledb from 'oracledb';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { Destination } from './entities/spt-destination';
import { DestinationInput } from './spt-destination.in';

@Resolver(Destination)
export class DestinationResolver {
  @Query(() => [Destination])
  @UseMiddleware(isAuth)
  async getAllDestinations(): Promise<Destination[] | undefined> {
    return await Destination.find();
  }

  @Query(() => Destination, { nullable: true })
  @UseMiddleware(isAuth)
  async getDestination(
    @Arg('destinationId') destinationId: string
  ): Promise<Destination | null> {
    return await Destination.findOneBy({ destinationId });
  }

  @Mutation(() => Destination)
  @UseMiddleware(isAuth)
  async createDestination(
    @Arg('input') input: DestinationInput
  ): Promise<Destination | null> {
    try {
      const sql = `
    BEGIN
      GBR_SPT_API.Create_Destination(:destinationId, :destinationName, :outDestinationId);
    END;
  `;
      const result = await ifs.query(sql, [
        input.destinationId,
        input.destinationName,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING }
      ]);
      const outDestinationId = result[0] as string;
      const data = Destination.findOneBy({
        destinationId: outDestinationId
      });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => Destination, { nullable: true })
  @UseMiddleware(isAuth)
  async updateDestination(
    @Arg('input') input: DestinationInput
  ): Promise<Destination | null> {
    try {
      const destination = await Destination.findOneBy({
        destinationId: input.destinationId
      });
      if (!destination) {
        throw new Error('No data found.');
      }
      const sql = `
    BEGIN
      GBR_SPT_API.Update_Destination(:destinationId, :destinationName,  :outDestinationId);
    END;
  `;
      const result = await ifs.query(sql, [
        input.destinationId,
        input.destinationName,
        { dir: oracledb.BIND_OUT, type: oracledb.STRING }
      ]);
      const outDestinationId = result[0];
      const data = Destination.findOneBy({
        destinationId: outDestinationId
      });
      return data;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  @Mutation(() => Destination)
  @UseMiddleware(isAuth)
  async deleteDestination(
    @Arg('destinationId') destinationId: string
  ): Promise<Destination> {
    try {
      const destination = await Destination.findOneBy({
        destinationId
      });
      if (!destination) throw new Error('No data found.');
      await Destination.delete({ destinationId });
      return destination;
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
