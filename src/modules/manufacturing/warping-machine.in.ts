import { MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { WarpingMachine } from './entities/warping-machine';

@InputType()
export class WarpingMachineInput implements Partial<WarpingMachine> {
  @Field()
  @MaxLength(10)
  machineId!: string;

  @Field({ nullable: true })
  @MaxLength(20)
  machineName?: string;

  @Field({ nullable: true })
  @MaxLength(5)
  contract?: string;
}
