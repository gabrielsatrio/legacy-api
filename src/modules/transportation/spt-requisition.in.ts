import { Length } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { Requisition } from './entities/spt-requisition';

@InputType()
export class RequisitionInput implements Partial<Requisition> {
  @Field()
  reqNo!: string;

  @Field()
  @Length(3, 10)
  destinationId!: string;

  @Field()
  ds!: string;

  @Field({ nullable: true })
  divisi?: string;

  @Field()
  @Length(1, 10)
  customerId!: string;

  @Field({ nullable: true })
  via?: string;

  @Field()
  requisitionDate!: Date;

  @Field()
  rollQty!: number;

  @Field({ nullable: true })
  space?: number;

  @Field({ nullable: true })
  meter?: number;

  @Field()
  weight!: number;

  @Field()
  volume!: number;

  @Field()
  @Length(3, 4)
  contract!: string;

  @Field({ nullable: true })
  notes?: string;
}
