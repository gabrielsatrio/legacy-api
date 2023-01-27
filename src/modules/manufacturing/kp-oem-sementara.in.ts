import { IsNumber, MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { KpOemSementara } from './entities/kp-oem-sementara';

@InputType()
export class KpOemSementaraInput implements Partial<KpOemSementara> {
  @Field()
  @MaxLength(5)
  contract!: string;

  @Field()
  @MaxLength(12)
  orderNo!: string;

  @Field()
  @MaxLength(70)
  lotBatchNo!: string;

  @Field()
  @IsNumber()
  pickAwal!: number;

  @Field()
  @IsNumber()
  pickAkhir!: number;
}
