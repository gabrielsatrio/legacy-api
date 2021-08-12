import { Field, ObjectType } from 'type-graphql';

@ObjectType()
class FieldError {
  @Field()
  message!: string;
  @Field({ nullable: true })
  field?: string;
  @Field({ nullable: true })
  code?: string;
}

export default FieldError;
