import { Length } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { YarnInterruptionTrans } from './entities/yarn-interruption-trans';

@InputType()
export class YarnInterruptionTransInput
  implements Partial<YarnInterruptionTrans>
{
  @Field()
  id!: number;

  @Field()
  @Length(1, 5)
  contract!: string;

  @Field()
  machine?: string;

  @Field()
  interruptionId!: string;

  @Field()
  freq!: number;

  @Field()
  durationMinute!: number;

  @Field()
  reportDate!: Date;
}
