import { IsBoolean, IsNumber, Length } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';
import { SparePartReqLineMachView } from './entities/apm-sp-requisition-line-mach.vw';

@InputType()
export class SparePartReqLineMachInput
  implements Partial<SparePartReqLineMachView>
{
  @Field(() => Int)
  @IsNumber()
  requisitionId!: number;

  @Field(() => Int)
  @IsNumber()
  lineItemNo!: number;

  @Field(() => Int)
  @IsNumber()
  releaseNo!: number;

  @Field(() => Int)
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

  @Field()
  @IsBoolean()
  nonKS!: boolean;
}
