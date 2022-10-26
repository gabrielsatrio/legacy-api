import { Length } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { BPOAuxiliaries } from './entities/ddp-bpo-auxiliaries';

@InputType()
export class BPOAuxiliariesInput implements Partial<BPOAuxiliaries> {
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

  @Field({ nullable: true })
  partActual?: string;

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

  @Field()
  beratAktual?: number;

  @Field({ nullable: true })
  qtyLot?: number;

  @Field({ nullable: true })
  lotBatchNo2?: string;

  @Field({ nullable: true })
  qtyLot2?: number;

  @Field({ nullable: true })
  statusReserve?: string;

  @Field()
  no!: number;

  @Field({ nullable: true })
  lineLot1?: number;
}
