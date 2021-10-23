import { Field, InputType } from 'type-graphql';
import { SuratJalan } from './entities/spt-surat-jalan';

@InputType()
export class SuratJalanInput implements Partial<SuratJalan> {
  @Field()
  reqNo!: string;

  @Field()
  rollQty!: number;

  @Field()
  meter!: number;

  @Field()
  weight!: number;

  @Field()
  volume!: number;

  @Field({ nullable: true })
  notes?: string;

  @Field({ nullable: true })
  licensePlate?: string;

  @Field({ nullable: true })
  nopolLangsir?: string;

  @Field({ nullable: true })
  driverName?: string;
}
