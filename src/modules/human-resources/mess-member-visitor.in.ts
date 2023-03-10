import { IsNumber, MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { MessMemberVisitor } from './entities/mess-member-visitor';

@InputType()
export class MessMemberVisitorInput implements Partial<MessMemberVisitor> {
  @Field()
  @IsNumber()
  id!: number;

  @Field()
  @MaxLength(20)
  mess!: string;

  @Field()
  @IsNumber()
  idForm!: number;

  @Field()
  @MaxLength(5)
  nrp!: string;

  @Field()
  @IsNumber()
  lamaMenginap!: number;

  @Field()
  @IsNumber()
  total!: number;

  @Field()
  @MaxLength(5)
  createdBy!: string;
}
