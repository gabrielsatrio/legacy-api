import { IsNumber, Length } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { SparePartReqLineMachView } from './entities/apm-sp-requisition-line-mach.vw';

@InputType()
export class SparePartReqLineMachInput
  implements Partial<SparePartReqLineMachView>
{
  @Field()
  @Length(9)
  requisitionId!: string;

  @Field()
  @IsNumber()
  lineItemNo!: number;

  @Field()
  @IsNumber()
  mapNo!: number;

  @Field()
  @Length(6)
  machineId!: string;

  @Field()
  @Length(3, 5)
  contract!: string;

  @Field()
  @IsNumber()
  quantity!: number;
}
