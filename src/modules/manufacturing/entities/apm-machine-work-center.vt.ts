import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class MachWorkCenter {
  @Field()
  workCenterNo!: string;

  @Field()
  contract!: string;

  @Field()
  description!: string;

  @Field()
  status!: string;

  @Field()
  machineId!: string;

  @Field()
  machineDescription!: string;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;

  @Field()
  objId!: string;
}
