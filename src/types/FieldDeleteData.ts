import { Field, ObjectType } from 'type-graphql';

@ObjectType()
class FieldDeleteData {
  @Field()
  isDeleted!: boolean;
}

export default FieldDeleteData;
