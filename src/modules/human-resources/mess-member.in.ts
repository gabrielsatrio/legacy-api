import { IsDate, IsNumber, MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { MessMember } from './entities/mess-member';

@InputType()
export class MessMemberInput implements Partial<MessMember> {
  @Field()
  @IsNumber()
  id!: number;

  @Field()
  @MaxLength(5)
  nrp!: string;

  @Field()
  @MaxLength(20)
  mess!: string;

  @Field()
  @MaxLength(5)
  insertBy!: string;

  @Field()
  @IsDate()
  validFrom!: Date;

  @Field()
  @IsDate()
  validTo!: Date;

  @Field()
  @IsNumber()
  isKetua!: number;
}
