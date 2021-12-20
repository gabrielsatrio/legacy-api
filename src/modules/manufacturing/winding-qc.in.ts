import { Length, MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { WindingQC } from './entities/winding-qc';

@InputType()
export class WindingQCInput implements Partial<WindingQC> {
  @Field()
  @Length(1, 5)
  contract!: string;

  @Field({ nullable: true })
  rollNo?: number;

  @Field()
  @Length(1, 100)
  design!: string;

  @Field()
  @Length(1, 200)
  lotBatchNo!: string;

  @Field()
  @Length(1, 200)
  pieceNo!: string;

  @Field()
  gross!: number;

  @Field()
  netto!: number;

  @Field({ nullable: true })
  @MaxLength(500)
  labelFisikKain?: string;

  @Field({ nullable: true })
  @MaxLength(500)
  garis?: string;

  @Field({ nullable: true })
  @MaxLength(500)
  gelombangTengah?: string;

  @Field({ nullable: true })
  @MaxLength(500)
  gelombangPinggir?: string;

  @Field({ nullable: true })
  @MaxLength(500)
  kerutan?: string;

  @Field({ nullable: true })
  @MaxLength(500)
  kusutRollan?: string;

  @Field({ nullable: true })
  @MaxLength(500)
  keterangan?: string;

  @Field({ nullable: true })
  @MaxLength(500)
  operator?: string;

  @Field({ nullable: true })
  @MaxLength(100)
  mesin?: string;

  @Field({ nullable: true })
  tanggal?: Date;

  @Field({ nullable: true })
  @MaxLength(100)
  shift?: string;

  @Field({ nullable: true })
  idNo?: number;
}
