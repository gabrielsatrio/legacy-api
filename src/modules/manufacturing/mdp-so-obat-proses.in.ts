import { IsDate, IsNumber, MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { SoObatProses } from './entities/mdp-so-obat-proses';

@InputType()
export class SoObatProsesInput implements Partial<SoObatProses> {
  @Field()
  @MaxLength(5)
  contract!: string;

  @Field()
  @MaxLength(50)
  partNo!: string;

  @Field()
  @IsDate()
  needDate!: Date;

  @Field()
  @IsNumber()
  qty!: number;

  @Field()
  @MaxLength(5)
  alternativeNo!: string;

  @Field({ nullable: true })
  @MaxLength(200)
  note?: string;

  @Field()
  @MaxLength(25)
  tipe!: string;

  @Field()
  @MaxLength(25)
  mesin!: string;

  @Field({ nullable: true })
  @MaxLength(25)
  orderNo?: string;

  @Field({ nullable: true })
  @IsNumber()
  drum?: number;

  @Field({ nullable: true })
  @IsNumber()
  qtyDrum?: number;
}
