import { Field, InputType } from 'type-graphql';
import { AssignDetail } from './entities/spt-assign-detail';

@InputType()
export class AssignDetailInput implements Partial<AssignDetail> {
  @Field()
  assignId!: string;

  @Field()
  assignDate!: Date;

  @Field()
  reqNo!: string;

  @Field()
  requisitionDate!: Date;

  @Field({ nullable: true })
  tipe?: string;

  @Field({ nullable: true })
  expeditionId?: string;

  @Field({ nullable: true })
  vehicleId?: string;

  @Field({ nullable: true })
  licensePlate?: string;

  @Field({ nullable: true })
  driverName?: string;

  @Field({ nullable: true })
  nomorResi?: string;
  @Field({ nullable: true })
  isNormalPrice?: string;

  @Field({ nullable: true })
  totalPrice?: number;

  @Field({ nullable: true })
  nopolLangsir?: string;

  @Field({ nullable: true })
  ppn?: string;

  @Field({ nullable: true })
  price?: number;
}
