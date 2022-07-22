import { MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { GisMachine } from './entities/gis-machine';

@InputType()
export class GisMachineInput implements Partial<GisMachine> {
  @Field()
  @MaxLength(5)
  contract!: string;

  @Field()
  @MaxLength(10)
  machineId!: string;

  @Field({ nullable: true })
  @MaxLength(30)
  machineName?: string;
}
