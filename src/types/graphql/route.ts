import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class Route {
  @Field({ nullable: true })
  to?: string;
}
