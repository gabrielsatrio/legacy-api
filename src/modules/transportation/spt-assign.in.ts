import { Field, InputType } from 'type-graphql';
import { Assign } from './entities/spt-assign';

@InputType()
export class AssignInput implements Partial<Assign> {
  @Field()
  assignId!: string;

  @Field()
  assignDate!: Date;

  // @Field()
  // createdAt!: Date;

  // @Field()
  // updatedAt!: Date;

  @Field()
  tipe!: string;
}
