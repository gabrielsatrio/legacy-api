import { IsNumber } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';
import { AngkutanDetail } from './entities/angkutan-detail';

@InputType()
export class AngkutanDetailInput implements Partial<AngkutanDetail> {
  @Field(() => Int)
  @IsNumber()
  id!: number;

  @Field({ nullable: true })
  bulan?: string;

  @Field({ nullable: true })
  contract?: string;

  @Field({ nullable: true })
  dept?: string;

  @Field({ nullable: true })
  jasaKirim?: number;

  @Field({ nullable: true })
  jasaKirimIncPpn?: number;

  @Field({ nullable: true })
  namaAngkutan?: string;

  @Field({ nullable: true })
  note?: string;

  @Field({ nullable: true })
  noAccount?: string;

  @Field({ nullable: true })
  noPolisi?: string;

  @Field({ nullable: true })
  noResi?: string;

  @Field({ nullable: true })
  other?: string;

  @Field({ nullable: true })
  periode?: string;

  @Field({ nullable: true })
  pilih?: string;

  @Field({ nullable: true })
  ppn?: number;

  @Field({ nullable: true })
  tahun?: string;

  @Field({ nullable: true })
  tglMuat?: Date;

  @Field({ nullable: true })
  upload?: string;

  @Field({ nullable: true })
  voucherNo?: string;

  @Field({ nullable: true })
  voucherNoTemp?: string;

  @Field({ nullable: true })
  angkutanId?: number;
}
