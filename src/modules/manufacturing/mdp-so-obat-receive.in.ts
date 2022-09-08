import { IsNumber, MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { SoObatProses } from './entities/mdp-so-obat-proses';

@InputType()
export class SoObatProsesReceiveInput implements Partial<SoObatProses> {
  @Field()
  @MaxLength(25)
  orderNo!: string;

  @Field()
  @IsNumber()
  qtyReceive!: number;

  @Field()
  @MaxLength(200)
  lotReceive!: string;

  @Field()
  @MaxLength(200)
  locationReceive!: string;

  @Field({ nullable: true })
  @MaxLength(200)
  lotSourceReceive?: string;

  @Field({ nullable: true })
  @MaxLength(200)
  note?: string;
}
