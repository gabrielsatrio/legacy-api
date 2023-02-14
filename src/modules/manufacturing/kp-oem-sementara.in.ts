import { IsDate, IsNumber, MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { KpOemSementara } from './entities/kp-oem-sementara';

@InputType()
export class KpOemSementaraInput implements Partial<KpOemSementara> {
  @Field()
  @MaxLength(5)
  contract!: string;

  @Field()
  @MaxLength(12)
  orderNo!: string;

  @Field()
  @MaxLength(70)
  lotBatchNo!: string;

  @Field({ nullable: true })
  @MaxLength(50)
  seriBeam?: string;

  @Field()
  @IsNumber()
  pickAwal!: number;

  @Field()
  @IsNumber()
  pickAkhir!: number;

  @Field()
  @MaxLength(10)
  status!: string;

  @Field()
  @IsDate()
  createdDate!: Date;

  @Field()
  @MaxLength(5)
  createdAt!: string;

  @Field()
  @IsDate()
  modifiedDate!: Date;

  @Field()
  @MaxLength(5)
  modifiedAt!: string;
}
