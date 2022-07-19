import { MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { InsMessMember } from './entities/mess-ins-member';

@InputType()
export class InsMessMemberInput implements Partial<InsMessMember> {
  @Field()
  @MaxLength(5)
  nrp!: string;

  @Field()
  @MaxLength(20)
  mess!: string;

  @Field()
  @MaxLength(5)
  insertBy!: string;
}
