import { IsNumber, MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { SoObatProsesMaterial } from './entities/mdp-so-obat-proses-mat';

@InputType()
export class SoObatProsesMaterialInput
  implements Partial<SoObatProsesMaterial>
{
  @Field()
  @MaxLength(5)
  contract!: string;

  @Field()
  @MaxLength(25)
  orderNo!: string;

  @Field({ nullable: true })
  @IsNumber()
  lineItemNo?: number;

  @Field({ nullable: true })
  @IsNumber()
  structureLineNo?: number;

  @Field({ nullable: true })
  @MaxLength(50)
  partNo?: string;

  @Field({ nullable: true })
  @IsNumber()
  scrapFactor?: number;

  @Field({ nullable: true })
  @IsNumber()
  scrapComponent?: number;

  @Field({ nullable: true })
  @IsNumber()
  qtyRequired?: number;

  @Field({ nullable: true })
  @MaxLength(50)
  lotBatchNo?: string;

  @Field({ nullable: true })
  @IsNumber()
  berat?: number;

  @Field({ nullable: true })
  @IsNumber()
  beratAwal?: number;

  @Field({ nullable: true })
  @IsNumber()
  beratNet?: number;
}
