import {
  IsBoolean,
  IsDate,
  IsIn,
  IsNumber,
  Length,
  MaxLength
} from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';
import { SparePartRequisition } from './entities/apm-sp-requisition';

@InputType()
export class SparePartRequisitionInput
  implements Partial<SparePartRequisition>
{
  @Field(() => Int)
  @IsNumber()
  requisitionId!: number;

  @Field({ nullable: true })
  @MaxLength(12)
  orderNo?: string;

  @Field()
  @Length(3, 5)
  contract!: string;

  @Field({ defaultValue: 'INT' })
  @Length(3)
  @IsIn(['INT'])
  orderClass!: string;

  @Field()
  @Length(3)
  intCustomerNo!: string;

  @Field({ nullable: true })
  @MaxLength(3)
  destinationId?: string;

  @Field()
  @IsDate()
  dueDate!: Date;

  @Field()
  @IsDate()
  createdAt!: Date;

  @Field({ defaultValue: false })
  @IsBoolean()
  urgent!: boolean;

  @Field()
  @Length(5)
  approverLv1!: string;

  @Field()
  @Length(5)
  approverLv2!: string;

  @Field()
  @IsIn(['Created', 'Submitted', 'Partially Approved', 'Approved', 'Rejected'])
  status!: string;
}
