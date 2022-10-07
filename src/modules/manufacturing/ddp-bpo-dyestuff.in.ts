import { Length } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { BPODyestuff } from './entities/ddp-bpo-dyestuff';

@InputType()
export class BPODyestuffInput implements Partial<BPODyestuff> {
  @Field()
  @Length(1, 5)
  contract!: string;

  @Field()
  @Length(1, 50)
  idNo!: string;

  @Field()
  @Length(1, 50)
  partNo!: string;

  @Field()
  @Length(1, 200)
  partDesc!: string;

  @Field()
  @Length(1, 50)
  kodeKuans!: string;

  @Field()
  persentase!: number;

  @Field()
  total!: number;

  @Field({ nullable: true })
  lotBatchNo?: string;

  @Field({ nullable: true })
  orderNo?: string;

  @Field()
  kuCount!: number;

  @Field({ nullable: true })
  qtyLot?: number;

  @Field({ nullable: true })
  lotBatchNo2?: string;

  @Field({ nullable: true })
  qtyLot2?: number;

  @Field({ nullable: true })
  statusReserve?: string;

  @Field({ nullable: true })
  lineLot1?: number;
}
