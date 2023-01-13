import { IsDate, IsNumber, MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { ImsInvPartInStock } from './entities/atj-ims-inv-part-in-stock';

@InputType()
export class ImsInvPartInStockInput implements Partial<ImsInvPartInStock> {
  @Field()
  @MaxLength(25)
  partNo!: string;

  @Field()
  @MaxLength(5)
  contract!: string;

  @Field()
  @MaxLength(15)
  warehouseId!: string;

  @Field()
  @MaxLength(5)
  bayId!: string;

  @Field()
  @MaxLength(5)
  rowId!: string;

  @Field()
  @MaxLength(5)
  tierId!: string;

  @Field()
  @MaxLength(5)
  binId!: string;

  @Field()
  @MaxLength(35)
  locationNo!: string;

  @Field()
  @MaxLength(20)
  lotBatchNo!: string;

  @Field()
  @IsNumber()
  qtyOnhand!: number;

  @Field()
  @IsNumber()
  catchQtyOnhand!: number;

  @Field({ nullable: true })
  @MaxLength(500)
  note?: string;

  @Field()
  @IsDate()
  createdDate!: Date;

  @Field()
  @MaxLength(5)
  createdBy!: string;

  @Field()
  @IsDate()
  modifiedDate!: Date;

  @Field()
  @MaxLength(5)
  modifiedBy!: string;
}
