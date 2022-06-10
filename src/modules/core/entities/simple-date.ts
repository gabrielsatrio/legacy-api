import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class SimpleDate {
  @Field()
  simpleDate!: Date;
}
