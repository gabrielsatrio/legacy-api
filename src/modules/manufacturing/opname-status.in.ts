import { Field, InputType } from 'type-graphql';
import { OpnameStatus } from './entities/opname-status';

@InputType()
export class OpnameStatusInput implements Partial<OpnameStatus> {
  @Field()
  objId!: string;

  @Field()
  contract!: string;

  @Field()
  username!: string;

  @Field()
  periode!: Date;

  @Field()
  time!: string;

  @Field({ nullable: true })
  opnameType?: string;

  @Field({ nullable: true })
  numOfLoc?: number;

  @Field({ nullable: true })
  locationNo?: string;

  @Field({ nullable: true })
  exclude?: string;
}
