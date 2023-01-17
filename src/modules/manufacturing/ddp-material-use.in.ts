import { Length, MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { MaterialUse } from './entities/ddp-material-use';

@InputType()
export class MaterialUseInput implements Partial<MaterialUse> {
  @Field()
  @Length(1, 5)
  contract!: string;

  @Field()
  idNo!: string;

  @Field({ nullable: true })
  @MaxLength(25)
  orderNo?: string;

  @Field()
  @Length(1, 50)
  tubeDyeing!: string;

  @Field()
  no!: number;

  @Field()
  lotBatchNo!: string;

  @Field()
  partNo!: string;

  @Field()
  length!: number;

  @Field({ nullable: true })
  lotBatchSource?: string;
}
