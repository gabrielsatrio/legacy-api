import { IsDate, IsNumber } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';
import { CourierFeePrepaid } from './entities/courier-fee-prepaid';

@InputType()
export class CourierFeePrepaidInput implements Partial<CourierFeePrepaid> {
  @Field(() => Int)
  @IsNumber()
  id!: number;

  @Field()
  contract!: string;

  @Field()
  division!: string;

  @Field({ nullable: true })
  salesmanCode?: string;

  @Field({ nullable: true })
  poNumber?: string;

  @Field({ nullable: true })
  currency?: string;

  @Field({ nullable: true })
  @IsNumber()
  deliveryNominal?: number;

  @Field()
  @IsDate()
  circulationDate!: Date;

  @Field()
  description!: string;

  @Field({ nullable: true })
  paymentMethod?: string;

  @Field({ nullable: true })
  arPersonnel?: string;

  @Field()
  courierServiceName!: string;

  @Field()
  awbNo!: string;

  @Field()
  type!: string;

  @Field()
  sender!: string;

  @Field()
  @IsDate()
  deliveryDate!: Date;

  @Field()
  receiver!: string;

  @Field()
  invoiceNoHd!: string;

  @Field({ nullable: true })
  @IsNumber()
  courierFee?: number;

  @Field({ nullable: true })
  invoiceNoAr?: string;

  @Field({ nullable: true })
  notes?: string;

  @Field({ nullable: true })
  emailUser?: string;

  @Field({ nullable: true })
  periodeBayar?: string;

  @Field({ nullable: true })
  @IsDate()
  financeReceiptDate?: Date;
}
