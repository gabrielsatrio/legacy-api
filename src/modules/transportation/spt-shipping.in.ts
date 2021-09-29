import { Length } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { Shipping } from './entities/spt-shipping';

@InputType()
export class ShippingInput implements Partial<Shipping> {
  @Field()
  shippingId!: string;

  @Field()
  @Length(1, 10)
  expeditionId!: string;

  @Field()
  @Length(1, 10)
  vehicleId!: string;

  @Field()
  @Length(1, 10)
  destinationId!: string;

  @Field()
  rate!: number;

  @Field()
  multidropRate!: number;
}
