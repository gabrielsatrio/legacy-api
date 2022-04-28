import { MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { TransportTaskHead } from './entities/tt-header';

@InputType()
export class TransportTaskHeadInput implements Partial<TransportTaskHead> {
  @Field()
  @MaxLength(5)
  contract!: string;

  @Field()
  orderQty!: number;

  @Field()
  @MaxLength(50)
  partNo!: string;

  @Field()
  @MaxLength(100)
  locationNo!: string;

  @Field()
  @MaxLength(50)
  user!: string;

  @Field()
  @MaxLength(50)
  type!: string;

  @Field()
  @MaxLength(50)
  transportTaskId?: string;
}
