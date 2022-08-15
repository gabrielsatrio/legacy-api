import { IsDate, IsNumber } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';
import { AbsensiKhl } from './entities/absensi-khl';

@InputType()
export class AbsensiKhlInput implements Partial<AbsensiKhl> {
  @Field(() => Int)
  @IsNumber()
  id!: number;

  @Field()
  plant!: string;

  @Field()
  deptCode!: string;

  @Field()
  deptName!: string;

  @Field()
  @IsDate()
  tanggal!: Date;

  @Field({ defaultValue: false })
  isDuplicate!: boolean;

  @Field(() => Int)
  @IsNumber()
  duplicateId!: number;

  @Field()
  createdBy!: string;
}
