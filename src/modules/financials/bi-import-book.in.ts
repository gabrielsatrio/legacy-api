import { IsNumber } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';
import { ImportBook } from './entities/bi-import-book';

@InputType()
export class ImportBookInput implements Partial<ImportBook> {
  @Field(() => Int)
  @IsNumber()
  id!: number;

  @Field({ nullable: true })
  poNumber?: string;

  @Field({ nullable: true })
  contract?: string;

  @Field({ nullable: true })
  supplierCode?: string;

  @Field({ nullable: true })
  supplierName?: string;

  @Field({ nullable: true })
  grandTotal?: number;

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
}
