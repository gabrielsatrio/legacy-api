import { IsBoolean, IsIn, IsNumber, Length, MaxLength } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';
import { SparePartReqLine } from './entities/apm-sp-requisition-line';

@InputType()
export class SparePartReqLineInput implements Partial<SparePartReqLine> {
  @Field(() => Int)
  @IsNumber()
  requisitionId!: number;

  @Field(() => Int)
  @IsNumber()
  lineItemNo!: number;

  @Field()
  @Length(5, 25)
  partNo!: string;

  @Field()
  @Length(3, 5)
  contract!: string;

  @Field({ nullable: true })
  @MaxLength(10)
  conditionCode?: string;

  @Field()
  @IsNumber()
  qtyDue!: number;

  @Field()
  @Length(1, 10)
  unitMeas!: string;

  @Field({ defaultValue: false })
  @IsBoolean()
  project!: boolean;

  @Field({ defaultValue: 'INT' })
  @Length(3)
  @IsIn(['INT'])
  orderClass!: string;

  @Field({ defaultValue: 'IO' })
  @Length(2)
  @IsIn(['IO', 'PO'])
  supplyCode!: string;

  @Field()
  @MaxLength(25)
  @IsIn(['Semua ada bekas', 'Sebagian ada bekas', 'Tidak ada bekas'])
  remainingDesc!: string;

  @Field()
  @IsNumber()
  remainingQty!: number;

  @Field({ nullable: true })
  @MaxLength(2000)
  note?: string;

  @Field({ defaultValue: false })
  @IsBoolean()
  assigned!: boolean;
}
