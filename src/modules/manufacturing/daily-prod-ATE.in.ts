import { Length } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { DailyProdATE } from './entities/daily-prod-ATE';

@InputType()
export class DailyProdATEInput implements Partial<DailyProdATE> {
  @Field()
  objId!: string;

  @Field()
  @Length(1, 5)
  contract!: string;

  @Field()
  reportDate?: Date;

  @Field()
  partNo!: string;

  @Field()
  partDesc!: string;

  @Field()
  machine!: string;

  @Field()
  lotNo!: string;

  @Field()
  goodProduct!: number;

  @Field()
  afal!: number;

  @Field()
  poNo!: string;

  @Field()
  keterangan!: string;

  @Field()
  orderNo!: string;
}
