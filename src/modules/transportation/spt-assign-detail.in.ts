import { Field, InputType } from 'type-graphql';
import { AssignDetail } from './entities/spt-assign-detail';

@InputType()
export class AssignDetailInput implements Partial<AssignDetail> {
  @Field()
  assignId!: string;

  @Field()
  assignDate!: Date;

  @Field()
  reqNo!: number;
}
