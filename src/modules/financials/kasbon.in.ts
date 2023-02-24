import { IsNumber } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';
import { Kasbon } from './entities/kasbon';

@InputType()
export class KasbonInput implements Partial<Kasbon> {
  @Field(() => Int)
  @IsNumber()
  id!: number;

  @Field()
  contract!: string;

  @Field()
  department!: string;

  @Field()
  kategori!: string;

  @Field()
  nomorPo!: string;

  @Field()
  @IsNumber()
  jumlah!: number;

  @Field()
  terbilang!: string;

  @Field()
  keperluan!: string;

  @Field()
  tglPertanggungjawaban!: Date;

  @Field()
  pembayaran!: string;

  @Field({ nullable: true })
  bank?: string;

  @Field({ nullable: true })
  namaRekening?: string;

  @Field({ nullable: true })
  noRekening?: string;

  @Field({ nullable: true })
  tglTransfer?: Date;

  @Field()
  status!: string;

  @Field()
  createdBy!: string;

  @Field()
  createdAt!: Date;

  @Field()
  apprAtasan!: string;

  @Field()
  apprAtasanStatus!: string;

  @Field()
  apprKas!: string;

  @Field()
  apprKasStatus!: string;

  @Field({ nullable: true })
  apprBank?: string;

  @Field({ nullable: true })
  apprBankStatus?: string;
}
