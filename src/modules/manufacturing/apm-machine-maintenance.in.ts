import { IsDate, IsNumber, MaxLength } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';
import { MachineMaintenance } from './entities/apm-machine-maintenance';

@InputType()
export class MachineMaintenanceInput implements Partial<MachineMaintenance> {
  @Field(() => Int)
  @IsNumber()
  maintenanceId!: number;

  @Field()
  @MaxLength(5)
  contract!: string;

  @Field()
  @MaxLength(6)
  machineId!: string;

  @Field()
  @IsDate()
  maintenanceDate!: Date;

  @Field()
  @MaxLength(3)
  categoryId!: string;

  @Field()
  @MaxLength(2000)
  description!: string;

  @Field({ nullable: true })
  @IsNumber()
  quantity?: number;

  @Field()
  @MaxLength(30)
  performedBy!: string;

  @Field()
  @MaxLength(100)
  personName?: string;

  @Field({ nullable: true })
  @MaxLength(12)
  mrNo?: string;

  @Field({ nullable: true })
  @MaxLength(4)
  mrLineNo?: string;

  @Field({ nullable: true })
  @MaxLength(4)
  mrReleaseNo?: string;

  @Field({ nullable: true })
  @IsNumber()
  mrLineItemNo?: number;

  @Field({ nullable: true })
  @MaxLength(3)
  mrOrderClass?: string;

  @Field({ nullable: true })
  @MaxLength(12)
  prNo?: string;

  @Field({ nullable: true })
  @MaxLength(4)
  prLineNo?: string;

  @Field({ nullable: true })
  @MaxLength(4)
  prReleaseNo?: string;

  @Field({ nullable: true })
  @MaxLength(12)
  poNo?: string;

  @Field({ nullable: true })
  @MaxLength(4)
  poLineNo?: string;

  @Field({ nullable: true })
  @MaxLength(4)
  poReleaseNo?: string;

  @Field()
  @IsDate()
  createdAt!: Date;
}
