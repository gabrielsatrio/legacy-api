import { IsNumber, MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { ProdWarpingDenier } from './entities/warping-denier';

@InputType()
export class ProdWarpingDenierInput implements Partial<ProdWarpingDenier> {
  @Field()
  @IsNumber()
  id!: number;

  @Field()
  @IsNumber()
  lineNo!: number;

  @Field()
  @MaxLength(10)
  jumlahLusi!: string;

  @Field()
  @MaxLength(10)
  denier!: string;

  @Field()
  @IsNumber()
  jumlahBobin!: number;
}
