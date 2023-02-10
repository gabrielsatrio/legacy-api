import { IsDate, IsNumber, MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { KpOemMesinSortir } from './entities/kp-oem-mesin-sortir';

@InputType()
export class KpOemMesinSortirInput implements Partial<KpOemMesinSortir> {
  @Field()
  @MaxLength(5)
  contract!: string;

  @Field()
  @MaxLength(12)
  orderNo!: string;

  @Field()
  @MaxLength(70)
  lotBatchNo!: string;

  @Field()
  @IsNumber()
  quantity!: number;

  @Field()
  @MaxLength(15)
  status!: string;

  @Field()
  @IsDate()
  createdDate!: Date;

  @Field()
  @IsDate()
  modifiedDate!: Date;
}
