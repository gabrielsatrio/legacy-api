import { IsNumber } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';
import { AbsensiKhlDetail } from './entities/absensi-khl-detail';

@InputType()
export class AbsensiKhlDetailInput implements Partial<AbsensiKhlDetail> {
  @Field(() => Int)
  @IsNumber()
  id!: number;

  @Field()
  nrp!: string;

  @Field(() => Int)
  @IsNumber()
  employeeKhlId!: number;
}
