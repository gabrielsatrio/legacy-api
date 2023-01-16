import { IsDate, IsNumber, MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { ImsInvTransactionHist } from './entities/atj-ims-inv-transaction-hist';

@InputType()
export class ImsInvTransactionHistInput
  implements Partial<ImsInvTransactionHist>
{
  @Field()
  @IsNumber()
  transactionId!: number;

  @Field()
  @MaxLength(25)
  partNo!: string;

  @Field()
  @MaxLength(5)
  contract!: string;

  @Field()
  @MaxLength(35)
  locationNo!: string;

  @Field()
  @MaxLength(20)
  lotBatchNo!: string;

  @Field({ nullable: true })
  @MaxLength(35)
  destinationLocation?: string;

  @Field()
  @IsNumber()
  quantity!: number;

  @Field({ nullable: true })
  @IsNumber()
  catchQty?: number;

  @Field({ nullable: true })
  @MaxLength(500)
  note?: string;

  @Field()
  @MaxLength(10)
  transactionCode!: string;

  @Field()
  @IsNumber()
  qtyReversed!: number;

  @Field()
  @IsDate()
  createdDate!: Date;

  @Field()
  @MaxLength(5)
  createdBy!: string;
}
