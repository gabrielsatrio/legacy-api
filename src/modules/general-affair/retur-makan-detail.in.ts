import { IsDate, IsNumber } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';
import { ReturMakanDetail } from './entities/retur-makan-detail';

@InputType()
export class ReturMakanDetailInput implements Partial<ReturMakanDetail> {
  @Field(() => Int)
  @IsNumber()
  id!: number;

  @Field()
  dept!: string;

  @Field()
  plant!: string;

  @Field()
  @IsDate()
  tanggal!: Date;

  @Field()
  @IsNumber()
  budget!: number;

  @Field()
  @IsNumber()
  permintaan!: number;

  @Field()
  @IsNumber()
  realisasi!: number;

  @Field()
  @IsNumber()
  selisih!: number;

  @Field(() => Int)
  @IsNumber()
  returMakanId!: number;
}
