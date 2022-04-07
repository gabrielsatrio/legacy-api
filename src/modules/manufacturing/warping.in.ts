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
  mesin!: string;

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
  segmen1?: string;

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
  @MaxLength(50)
  lotBenang2?: string;

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
  @MaxLength(200)
  notes?: string;
  @Field({ nullable: true })
  @IsDate()
  createdAt?: Date;
}
