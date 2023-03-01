import { IsNumber } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';
import { TravelVoucher } from './entities/travel-voucher';

@InputType()
export class TravelVoucherInput implements Partial<TravelVoucher> {
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
