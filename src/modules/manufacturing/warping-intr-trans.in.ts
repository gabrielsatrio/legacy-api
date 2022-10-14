import { IsNumber } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { ProdWarpingIntrTrans } from './entities/warping-intr-trans';

@InputType()
export class ProdWarpingIntrTransInput
  implements Partial<ProdWarpingIntrTrans>
{
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
