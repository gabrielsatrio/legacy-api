import { IsNumber } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';
import { ImportBookParam } from './entities/bi-import-book-param';

@InputType()
export class ImportBookParamInput implements Partial<ImportBookParam> {
  @Field(() => Int)
  @IsNumber()
  id!: number;

  @Field()
  contract!: string;

  @Field()
  poNumber!: string;
}
