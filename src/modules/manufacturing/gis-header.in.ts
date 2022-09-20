import { IsDate, IsNumber, MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { GisHeader } from './entities/gis-header';

@InputType()
export class GisHeaderInput implements Partial<GisHeader> {
  @Field()
  @IsNumber()
  inspectId!: number;

  @Field()
  @MaxLength(5)
  contract!: string;

  @Field()
  @IsDate()
  reportDate!: Date;

  @Field({ nullable: true })
  @MaxLength(10)
  orderNo?: string;

  @Field()
  @MaxLength(50)
  partNo!: string;

  @Field({ nullable: true })
  @MaxLength(20)
  pieceNo?: string;

  @Field()
  @MaxLength(5)
  widthId!: string;

  @Field()
  @IsNumber()
  kpQty!: number;

  @Field()
  @IsNumber()
  actualQty!: number;

  @Field({ nullable: true })
  @MaxLength(10)
  color1?: string;

  @Field({ nullable: true })
  @MaxLength(20)
  weavingMc1?: string;

  @Field({ nullable: true })
  @MaxLength(20)
  inspectMc14?: string;

  @Field({ nullable: true })
  @MaxLength(50)
  judgement1?: string;

  @Field({ nullable: true })
  @MaxLength(50)
  jobOrder4?: string;

  @Field({ nullable: true })
  @MaxLength(5)
  shift4?: string;

  @Field({ nullable: true })
  @MaxLength(10)
  category4?: string;

  @Field({ nullable: true })
  @IsNumber()
  m2Qty4?: number;

  @Field({ nullable: true })
  @MaxLength(30)
  defectName4?: string;

  @Field({ nullable: true })
  @MaxLength(30)
  seriBeam?: string;

  @Field({ nullable: true })
  rollNo?: number;

  @Field({ nullable: true })
  @MaxLength(30)
  inspectType?: string;

  @Field({ nullable: true })
  totalMeter?: number;

  @Field({ nullable: true })
  lotBatchNo?: string;

  @Field({ nullable: true })
  actualWidth1?: number;

  @Field({ nullable: true })
  employeeId?: string;

  @Field({ nullable: true })
  notes?: string;

  @Field({ nullable: true })
  mcNo2?: string;

  @Field({ nullable: true })
  side2?: string;

  @Field({ nullable: true })
  inspectType2?: string;
}
