import { IsDate, IsNumber, MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { DailyReportDyg } from './entities/daily-report-dyg';

@InputType()
export class DailyReportDygInput implements Partial<DailyReportDyg> {
  @Field()
  @MaxLength(5)
  contract!: string;

  @Field()
  @IsDate()
  tanggal!: Date;

  @Field({ nullable: true })
  @MaxLength(50)
  lotDyeing?: string;

  @Field()
  @IsNumber()
  startHour!: number;

  @Field()
  @IsNumber()
  endHour!: number;

  @Field()
  @IsNumber()
  durasiHour!: number;

  @Field()
  @MaxLength(100)
  aktivitas!: string;

  @Field({ nullable: true })
  @MaxLength(25)
  mesin?: string;

  @Field({ nullable: true })
  @IsNumber()
  beratBahan?: number;

  @Field({ nullable: true })
  @IsNumber()
  actualMeter?: number;

  @Field({ nullable: true })
  @IsNumber()
  lossInt?: number;

  @Field({ nullable: true })
  @IsNumber()
  lossExt?: number;

  @Field({ nullable: true })
  @MaxLength(100)
  jenisLoss?: string;

  @Field({ nullable: true })
  @MaxLength(25)
  tipeLoss?: string;

  @Field({ nullable: true })
  @MaxLength(50)
  targetDesign?: string;

  @Field({ nullable: true })
  @IsNumber()
  targetWaktu?: number;

  @Field({ nullable: true })
  @IsNumber()
  targetMeter?: number;

  @Field({ nullable: true })
  @MaxLength(100)
  serahTerima?: string;

  @Field({ nullable: true })
  @IsNumber()
  qtyLossTime?: number;

  @Field({ nullable: true })
  @MaxLength(100)
  optKaru?: string;

  @Field({ nullable: true })
  @MaxLength(25)
  judgement?: string;

  @Field({ nullable: true })
  @MaxLength(100)
  auxUse?: string;

  @Field({ nullable: true })
  @MaxLength(200)
  note?: string;

  @Field({ nullable: true })
  @IsNumber()
  air?: number;
}
