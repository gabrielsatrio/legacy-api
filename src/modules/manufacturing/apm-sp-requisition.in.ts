import { IsBoolean, IsDate, IsIn, Length, MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { SparePartRequisition } from './entities/apm-sp-requisition';

@InputType()
export class SparePartRequisitionInput
  implements Partial<SparePartRequisition>
{
  @Field()
  @Length(9)
  requisitionId!: string;

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

  @Field({ defaultValue: false })
  @IsBoolean()
  urgent!: boolean;

  @Field()
  @Length(5)
  approverLv1!: string;

  @Field()
  @Length(12, 100)
  emaillApprLv1!: string;

  @Field()
  @Length(5)
  approverLv2!: string;

  @Field()
  @Length(12, 100)
  emaillApprLv2!: string;

  @Field()
  @IsIn([
    'Planned',
    'Released',
    'Partially Approved',
    'Approved',
    'Partially Delivered',
    'Closed',
    'Stopped',
    'Cancelled'
  ])
  status!: string;
}
