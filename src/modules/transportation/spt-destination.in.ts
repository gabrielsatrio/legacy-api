import { Field, InputType } from 'type-graphql';
import { Destination } from './entities/spt-destination';

@InputType()
export class DestinationInput implements Partial<Destination> {
  @Field()
  destinationId!: string;

  @Field()
  destinationName!: string;
}
