import { IsDate, IsNumber, MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { KontrolBakuBenang } from './entities/kontrol-baku-benang';

@InputType()
export class KontrolBakuBenangInput implements Partial<KontrolBakuBenang> {
  @Field()
  @IsNumber()
  id!: number;

  @Field()
  @MaxLength(5)
  contract!: string;

  @Field()
  @MaxLength(10)
  orderNo!: string;

  @Field()
  @MaxLength(10)
  orderType!: string;

  @Field()
  @IsDate()
  doDate!: Date;

  @Field()
  @MaxLength(10)
  diameter!: string;
  @Field()
  @IsDate()
  createdAt!: Date;
}
