import { IsDate, IsNumber, MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { ProdWarping } from './entities/warping';

@InputType()
export class ProdWarpingInput implements Partial<ProdWarping> {
  @Field()
  @IsNumber()
  id!: number;

  @Field({ nullable: true })
  @MaxLength(5)
  contract?: string;

  @Field()
  @MaxLength(10)
  orderNo!: string;

  @Field({ nullable: true })
  @MaxLength(50)
  partNo?: string;

  @Field({ nullable: true })
  @MaxLength(100)
  partDesc?: string;

  @Field()
  @IsDate()
  tglProd!: Date;

  @Field()
  @MaxLength(20)
  shift!: string;

  @Field()
  @MaxLength(50)
  machineId!: string;

  @Field({ nullable: true })
  @MaxLength(50)
  jobOrder1?: string;

  @Field({ nullable: true })
  @MaxLength(50)
  design1?: string;

  @Field({ nullable: true })
  @IsNumber()
  qtyM1?: number;

  @Field({ nullable: true })
  @MaxLength(50)
  seriBeam1?: string;

  @Field({ nullable: true })
  @MaxLength(20)
  segmen?: string;

  @Field({ nullable: true })
  @IsNumber()
  lusi1?: number;

  @Field({ nullable: true })
  @IsNumber()
  jumlahLusi1?: number;

  @Field({ nullable: true })
  @MaxLength(10)
  denier1?: string;

  @Field({ nullable: true })
  @IsNumber()
  afalAktual1?: number;

  @Field({ nullable: true })
  @MaxLength(50)
  jenisBenang2?: string;

  @Field({ nullable: true })
  @MaxLength(30)
  lotBatchNo?: string;

  @Field({ nullable: true })
  @MaxLength(20)
  jumlahHelaiLusi2?: string;

  @Field({ nullable: true })
  @IsNumber()
  panjangLusi2?: number;

  @Field({ nullable: true })
  @IsNumber()
  qtyKg2?: number;

  @Field({ nullable: true })
  @IsNumber()
  targetBan2?: number;

  @Field({ nullable: true })
  @IsNumber()
  jumlahBan2?: number;

  @Field({ nullable: true })
  @MaxLength(20)
  noMcTenun2?: string;

  @Field({ nullable: true })
  @MaxLength(20)
  soBeam4?: string;

  @Field({ nullable: true })
  @MaxLength(20)
  soTenun4?: string;

  @Field({ nullable: true })
  @MaxLength(50)
  corakKain4?: string;

  @Field({ nullable: true })
  @MaxLength(20)
  warnaLusi4?: string;

  @Field({ nullable: true })
  qtyOrder4?: number;

  @Field({ nullable: true })
  benangPerBobin4?: number;

  @Field({ nullable: true })
  @MaxLength(10)
  mcBenang4?: string;

  @Field({ nullable: true })
  @IsNumber()
  meterBeam4?: number;

  @Field({ nullable: true })
  @IsNumber()
  jmlPasang4?: number;

  @Field({ nullable: true })
  @IsNumber()
  lebarBeam4?: number;

  @Field({ nullable: true })
  @IsNumber()
  lebarBan4?: number;

  @Field({ nullable: true })
  @IsNumber()
  feedMesin4?: number;

  @Field({ nullable: true })
  @MaxLength(200)
  notes?: string;
  @Field({ nullable: true })
  @IsDate()
  createdAt?: Date;
}
