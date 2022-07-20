import { IsNumber, MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { MessCompanyVisitor } from './entities/mess-company-visitor';

@InputType()
export class MessCompanyVisitorInput implements Partial<MessCompanyVisitor> {
  @Field()
  @IsNumber()
  id!: number;

  @Field()
  @MaxLength(20)
  mess!: string;

  @Field()
  @IsNumber()
  idForm!: number;

  @Field({ nullable: true })
  @MaxLength(10)
  nama?: string;

  @Field()
  @IsNumber()
  lamaMenginap!: number;

  @Field()
  @IsNumber()
  total!: number;

  @Field()
  @MaxLength(5)
  insertBy!: string;
}
