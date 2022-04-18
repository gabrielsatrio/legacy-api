import { IsNumber, MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { WarpingMachine } from './entities/warping-machine';

@InputType()
export class WarpingMachineInput implements Partial<WarpingMachine> {
  @Field()
  @IsNumber()
  id!: number;

  @Field({ nullable: true })
  @MaxLength(50)
  name?: string;

  @Field({ nullable: true })
  @MaxLength(5)
  contract?: string;
}
