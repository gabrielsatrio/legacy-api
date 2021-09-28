import { Length, MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { Material } from './entities/ddp-material';

@InputType()
export class MaterialInput implements Partial<Material> {
  @Field()
  @Length(1, 5)
  contract!: string;

  @Field()
  @Length(1, 50)
  jenisCelup!: string;

  @Field()
  idNo!: string;

  @Field({ nullable: true })
  tanggal?: Date;

  @Field()
  @Length(1, 50)
  partNo!: string;

  @Field({ nullable: true })
  @MaxLength(300)
  mediaCelup!: string;

  @Field()
  hasilCounterMeter!: number;

  @Field({ nullable: true })
  @MaxLength(300)
  orderNo?: string;

  @Field()
  @Length(1, 50)
  noMesin!: string;

  @Field({ nullable: true })
  @MaxLength(300)
  jmlMediaCelup?: string;

  @Field()
  tara!: number;

  @Field()
  bruto!: number;

  @Field()
  netto!: number;

  @Field({ nullable: true })
  @MaxLength(300)
  note?: string;

  @Field()
  @Length(1, 50)
  lotCelup!: string;

  @Field({ nullable: true })
  tara2?: number;

  @Field({ nullable: true })
  bruto2?: number;

  @Field({ nullable: true })
  netto2?: number;

  @Field({ nullable: true })
  @MaxLength(300)
  mediaCelup2!: string;

  @Field({ nullable: true })
  @MaxLength(300)
  jmlMediaCelup2?: string;
}
