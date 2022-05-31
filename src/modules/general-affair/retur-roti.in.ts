import { IsDate, IsNumber } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { ReturRoti } from './entities/retur-roti';

@InputType()
export class ReturRotiInput implements Partial<ReturRoti> {
  @Field()
  @IsNumber()
  id!: number;

  @Field()
  plant!: string;

  @Field()
  @IsDate()
  tanggal!: Date;

  @Field()
  createdBy!: string;
}
