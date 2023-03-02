import { IsNumber } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';
import { MedicalVoucher } from './entities/medical-voucher';

@InputType()
export class MedicalVoucherInput implements Partial<MedicalVoucher> {
  @Field(() => Int)
  @IsNumber()
  id!: number;

  @Field()
  contract!: string;

  @Field({ nullable: true })
  dept?: string;

  @Field()
  @IsNumber()
  nominal!: number;

  @Field({ nullable: true })
  noAccount?: string;

  @Field({ nullable: true })
  voucherNoTemp?: string;

  @Field({ nullable: true })
  voucherNo?: string;

  @Field({ nullable: true })
  note?: string;

  @Field()
  claimNo!: string;
}
