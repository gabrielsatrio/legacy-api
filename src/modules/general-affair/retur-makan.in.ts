import { IsDate, IsNumber } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';
import { ReturMakan } from './entities/retur-makan';

@InputType()
export class ReturMakanInput implements Partial<ReturMakan> {
  @Field(() => Int)
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
