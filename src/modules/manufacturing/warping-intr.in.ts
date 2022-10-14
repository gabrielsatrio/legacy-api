import { IsNumber } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { ProdWarpingIntr } from './entities/warping-intr';

@InputType()
export class ProdWarpingIntrInput implements Partial<ProdWarpingIntr> {
  @Field()
  @IsNumber()
  id!: number;

  @Field()
  @IsNumber()
  lineNo!: number;

  @Field()
  kodeGangguan!: string;

  @Field()
  @IsNumber()
  durasi!: number;
}
