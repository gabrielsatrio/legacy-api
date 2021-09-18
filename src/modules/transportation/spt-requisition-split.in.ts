import { Field, InputType } from 'type-graphql';
import { Requisition } from './entities/spt-requisition';

@InputType()
export class RequisitionSplitInput implements Partial<Requisition> {
  @Field()
  reqNo!: string;

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
  reqNoSplit!: string;

  // @Field()
  // requisitionDateSplit!: Date;

  @Field()
  rollQtySplit!: number;

  @Field({ nullable: true })
  meterSplit?: number;

  @Field()
  weightSplit!: number;

  @Field()
  volumeSplit!: number;
}
