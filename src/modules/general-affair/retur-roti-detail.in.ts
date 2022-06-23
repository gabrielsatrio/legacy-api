import { IsDate, IsNumber } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';
import { ReturRotiDetail } from './entities/retur-roti-detail';

@InputType()
export class ReturRotiDetailInput implements Partial<ReturRotiDetail> {
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
  pRotiBesar!: number;

  @Field()
  @IsNumber()
  pRotiKecil!: number;

  @Field()
  @IsNumber()
  rtrRotiBesar!: number;

  @Field()
  @IsNumber()
  rtrRotiKecil!: number;

  @Field()
  @IsNumber()
  rRotiBesar!: number;

  @Field()
  @IsNumber()
  rRotiKecil!: number;

  @Field(() => Int)
  @IsNumber()
  returRotiId!: number;
}
