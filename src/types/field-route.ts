import { Field, ObjectType } from 'type-graphql';

@ObjectType()
class FieldRoute {
  @Field({ nullable: true })
  to?: string;
}

export default FieldRoute;
