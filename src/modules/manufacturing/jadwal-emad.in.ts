import { IsDate, IsNumber, MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { JadwalEmad } from './entities/jadwal-emad';

@InputType()
export class JadwalEmadInput implements Partial<JadwalEmad> {
  @Field()
  @IsNumber()
  id!: number;

  @Field()
  @MaxLength(5)
  contract!: string;

  @Field()
  @MaxLength(20)
  orderNo!: string;

  @Field()
  @IsNumber()
  spindle!: number;

  @Field()
  @MaxLength(50)
  partNo!: string;

  @Field({ nullable: true })
  @MaxLength(200)
  note?: string;

  @Field()
  @MaxLength(20)
  dopId!: string;

  @Field()
  @IsNumber()
  qty!: number;

  @Field()
  @IsDate()
  estDate!: Date;

  @Field()
  @IsNumber()
  lotSize!: number;

  @Field()
  @IsNumber()
  qtyComplete!: number;

  @Field()
  @IsNumber()
  qtyRemaining!: number;
}
