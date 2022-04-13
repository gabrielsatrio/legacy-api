import { IsNumber, MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { TargetGangguan } from './entities/target-gangguan-dyeing';

@InputType()
export class TargetGangguanInput implements Partial<TargetGangguan> {
  @Field()
  @MaxLength(5)
  contract!: string;

  @Field()
  @MaxLength(50)
  partNo!: string;

  @Field()
  @IsNumber()
  waktu!: number;

  @Field()
  @IsNumber()
  meter!: number;
}
