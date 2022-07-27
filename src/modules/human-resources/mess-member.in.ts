import { IsBoolean, IsDate, IsNumber, MaxLength } from 'class-validator';
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
  createdBy!: string;

  @Field()
  @IsDate()
  validFrom!: Date;

  @Field()
  @IsDate()
  validTo!: Date;

  @Field()
  @IsBoolean()
  isKetua!: boolean;
}
