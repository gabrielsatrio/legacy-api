import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class File {
  @Field()
  success!: boolean;

  @Field()
  message!: string;

  @Field()
  mimetype!: string;

  @Field()
  encoding!: string;

  @Field()
  filename!: string;

  @Field()
  url!: string;
}
