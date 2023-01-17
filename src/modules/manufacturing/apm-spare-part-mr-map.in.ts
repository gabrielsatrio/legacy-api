import { IsBoolean, IsNumber, MaxLength } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';
import { SparePartMrMap } from './entities/apm-spare-part-mr-map';

@InputType()
export class SparePartMrMapInput implements Partial<SparePartMrMap> {
  @Field()
  @MaxLength(5)
  contract!: string;

  @Field()
  @MaxLength(12)
  orderNo!: string;

  @Field()
  @MaxLength(4)
  lineNo!: string;

  @Field()
  @MaxLength(4)
  releaseNo!: string;

  @Field(() => Int)
  @IsNumber()
  lineItemNo!: number;

  @Field()
  @MaxLength(3)
  orderClass!: string;

  @Field()
  @MaxLength(6)
  machineId!: string;

  @Field()
  @MaxLength(25)
  partNo!: string;

  @Field({ nullable: true })
  @IsNumber()
  quantity?: number;

  @Field({ defaultValue: false })
  @IsBoolean()
  nonKS!: boolean;
}
