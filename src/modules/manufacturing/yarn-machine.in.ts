import { Field, InputType } from 'type-graphql';
import { YarnMachine } from './entities/yarn-machine';

@InputType()
export class YarnMachineInput implements Partial<YarnMachine> {
  @Field({ nullable: true })
  id?: number;

  @Field()
  contract!: string;

  @Field()
  machine!: string;
}
