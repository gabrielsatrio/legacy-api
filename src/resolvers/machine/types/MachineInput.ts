import { Length, MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { Machine } from '../../../entities/Machine';

@InputType()
export class MachineInput implements Partial<Machine> {
  @Field()
  @Length(1, 5)
  machineId!: string;

  @Field()
  @Length(1, 200)
  machineName!: string;

  @Field()
  @Length(1, 15)
  machineType!: string;

  @Field()
  @Length(1, 3)
  makerId!: string;

  @Field()
  yearMade!: number;

  @Field()
  @Length(1, 50)
  serialNo!: string;

  @Field({ nullable: true })
  @MaxLength(50)
  controller!: string;

  @Field({ nullable: true })
  @MaxLength(50)
  launchMethod!: string;

  @Field({ nullable: true })
  @MaxLength(50)
  image!: string;

  @Field()
  isActive!: boolean;

  @Field({ nullable: true })
  @MaxLength(500)
  remarks!: string;
}
