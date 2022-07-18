import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class MenuItem {
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

  @Field(() => [MenuItem], { nullable: true })
  items?: MenuItem[];
}
