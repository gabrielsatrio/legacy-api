import { Field, ObjectType } from 'type-graphql';

@ObjectType()
class FieldMenu {
  @Field()
  id!: string;

  @Field()
  root!: string;

  @Field()
  name!: string;

  @Field()
  type!: string;

  @Field({ nullable: true })
  to?: string;

  @Field({ nullable: true })
  icon?: string;

  @Field(() => [FieldMenu], { nullable: true })
  items?: FieldMenu[];
}

export default FieldMenu;
