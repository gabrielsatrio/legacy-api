import { IsNumber } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';
import { Angkutan } from './entities/angkutan';

@InputType()
export class AngkutanInput implements Partial<Angkutan> {
  @Field(() => Int)
  @IsNumber()
  id!: number;

  @Field()
  contract!: string;

  @Field()
  angkutan!: string;

  @Field()
  startDate!: Date;

  @Field()
  endDate!: Date;

  @Field()
  createdBy!: string;

  @Field()
  usernameIfs!: string;

  @Field()
  createdAt!: Date;

  @Field({ nullable: true })
  voucherDate?: Date;
}
