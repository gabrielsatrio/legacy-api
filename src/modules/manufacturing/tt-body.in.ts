import { MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { TransportTaskBody } from './entities/tt-detail';

@InputType()
export class TransportTaskBodyInput implements Partial<TransportTaskBody> {
  @Field()
  @MaxLength(25)
  transportTaskId!: string;

  @Field()
  @MaxLength(50)
  lotBatchNo!: string;

  @Field()
  @MaxLength(50)
  partNo!: string;

  @Field()
  quantity!: number;

  @Field()
  @MaxLength(100)
  locationNo!: string;

  @Field()
  @MaxLength(50)
  user!: string;

  @Field()
  @MaxLength(50)
  type!: string;
}
