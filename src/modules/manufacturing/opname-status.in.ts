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

  @Field()
  dept!: string;

  @Field({ nullable: true })
  type?: string;

  @Field({ nullable: true })
  numOfLocation?: number;

  @Field({ nullable: true })
  locationNo?: string;
}
