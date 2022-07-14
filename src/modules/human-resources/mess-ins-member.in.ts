import { Field, InputType } from 'type-graphql';
import { InsMessMember } from './entities/mess-ins-member';

@InputType()
export class InsMessMemberInput implements Partial<InsMessMember> {
  @Field()
  nrp!: string;
  @Field()
  mess!: string;
  @Field()
  insert_by!: string;
}
