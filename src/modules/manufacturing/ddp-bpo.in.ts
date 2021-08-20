import { Length } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { DDPBPO } from './entities/ddp-bpo';

@InputType()
export class BPOInput implements Partial<DDPBPO> {
  @Field()
  @Length(1, 50)
  idNo!: string;

  @Field({ nullable: true })
  tanggal?: Date;

  @Field()
  @Length(1, 50)
  partNo!: string;

  @Field({ nullable: true })
  orderNo?: string;

  @Field()
  @Length(1, 50)
  noMesin!: string;

  @Field()
  lotCelup!: string;

  @Field()
  liquidRatio!: number;

  @Field()
  volume!: number;

  @Field()
  weight!: number;

  @Field()
  altReceipe?: string;

  @Field({ nullable: true })
  programNo?: string;

  @Field()
  kuCount!: number;

  @Field()
  sentToAux!: number;

  @Field()
  @Length(1, 5)
  contract!: string;
}
