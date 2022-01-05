import { Length } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { YarnEff } from './entities/yarn-eff';

@InputType()
export class YarnEffInput implements Partial<YarnEff> {
  @Field()
  objId!: string;

  @Field()
  @Length(1, 5)
  contract!: string;

  @Field()
  reportDate?: Date;

  @Field()
  employeeId!: string;

  @Field()
  shift!: string;

  @Field()
  machine!: string;

  @Field()
  yarnType!: string;

  @Field()
  gradeA!: number;

  @Field()
  gradeB!: number;

  @Field()
  afal!: number;
}
