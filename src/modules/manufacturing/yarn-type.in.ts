import { Field, InputType } from 'type-graphql';
import { YarnType } from './entities/yarn-type';

@InputType()
export class YarnTypeInput implements Partial<YarnType> {
  @Field()
  id!: number;

  @Field()
  contract!: string;

  @Field()
  yarnType!: string;
}
