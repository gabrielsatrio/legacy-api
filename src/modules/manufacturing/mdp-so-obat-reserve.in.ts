import { IsNumber, MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { SoObatReserve } from './entities/mdp-so-obat-reserve';

@InputType()
export class SoObatReserveInput implements Partial<SoObatReserve> {
  @Field()
  @MaxLength(5)
  contract!: string;

  @Field()
  @MaxLength(25)
  orderNo!: string;

  @Field()
  @IsNumber()
  lineNo!: number;

  @Field()
  @MaxLength(50)
  lotBooking!: string;
}
