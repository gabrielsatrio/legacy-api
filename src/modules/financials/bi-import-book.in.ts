import { IsNumber } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';
import { ImportBook } from './entities/bi-import-book';

@InputType()
export class ImportBookInput implements Partial<ImportBook> {
  @Field(() => Int)
  @IsNumber()
  id!: number;

  @Field()
  poNumber!: string;

  @Field()
  contract!: string;

  @Field()
  supplierCode!: string;

  @Field()
  supplierName!: string;

  @Field()
  grandTotal!: number;

  @Field({ nullable: true })
  accountNo?: string;

  @Field({ nullable: true })
  top?: string;

  @Field({ nullable: true })
  lc?: string;

  @Field({ nullable: true })
  lcNo?: string;

  @Field({ nullable: true })
  paidBy?: string;

  @Field({ nullable: true })
  lcCharges?: string;

  @Field({ nullable: true })
  currency?: string;

  @Field({ nullable: true })
  amount?: number;

  @Field({ nullable: true })
  paidDate?: Date;

  @Field()
  imptId!: number;
}
