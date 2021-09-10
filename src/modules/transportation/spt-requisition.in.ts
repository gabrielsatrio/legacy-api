import { Length } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { Requisition } from './entities/spt-requisition';

@InputType()
export class RequisitionInput implements Partial<Requisition> {
  @Field()
  reqNo!: number;

  @Field()
  @Length(1, 3)
  destinationId!: string;

  @Field()
  @Length(1, 10)
  customerId!: string;

  @Field()
  requisitionDate!: Date;

  @Field()
  rollQty!: number;

  @Field({ nullable: true })
  meter?: number;

  @Field()
  weight!: number;

  @Field()
  volume!: number;

  @Field()
  @Length(1, 5)
  contract!: string;
}
