import { IsDate, IsIn, IsNumber, Length, MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { Machine } from './entities/apm-machine';

@InputType()
export class MachineInput implements Partial<Machine> {
  @Field()
  @Length(6)
  machineId!: string;

  @Field()
  @Length(3, 5)
  contract!: string;

  @Field()
  @Length(1, 500)
  description!: string;

  @Field()
  @Length(2)
  categoryId!: string;

  @Field()
  @Length(1, 15)
  type!: string;

  @Field()
  @Length(2)
  makerId!: string;

  @Field()
  @Length(1, 50)
  serialNo!: string;

  @Field()
  @IsNumber()
  yearMade!: number;

  @Field()
  @IsDate()
  purchaseDate!: Date;

  @Field()
  @Length(3)
  departmentId!: string;

  @Field({ nullable: true })
  @MaxLength(10)
  workCenterNo?: string;

  @Field()
  @IsIn(['Active', 'Inactive', 'Sold', 'Scrapped'])
  status!: string;

  @Field({ nullable: true })
  @MaxLength(500)
  note?: string;

  @Field({ nullable: true })
  @MaxLength(30)
  image1?: string;

  @Field({ nullable: true })
  @MaxLength(30)
  image2?: string;

  @Field({ nullable: true })
  @IsNumber()
  totalSpindle?: number;

  @Field({ nullable: true })
  @IsNumber()
  totalMaxCreel?: number;

  @Field({ nullable: true })
  @MaxLength(50)
  controllerType?: string;

  @Field({ nullable: true })
  @MaxLength(50)
  oilingDevice?: string;

  @Field({ nullable: true })
  @MaxLength(50)
  controller?: string;

  @Field({ nullable: true })
  @MaxLength(50)
  @IsIn(['Rapier', 'Airjet', ''])
  launchMethod?: string;

  @Field({ nullable: true })
  @MaxLength(50)
  @IsIn(['Flexible', 'Rigid', ''])
  rapierType?: string;

  @Field({ nullable: true })
  @IsNumber()
  widthInCm?: number;

  @Field({ nullable: true })
  @IsNumber()
  totalAccumulator?: number;

  @Field({ nullable: true })
  @IsNumber()
  totalSelector?: number;

  @Field({ nullable: true })
  @IsNumber()
  totalHarness?: number;

  @Field({ nullable: true })
  @IsNumber()
  endCapacity?: number;

  @Field({ nullable: true })
  @MaxLength(15)
  gang?: string;

  @Field({ nullable: true })
  @MaxLength(15)
  gauge?: string;

  @Field({ nullable: true })
  @IsNumber()
  feeder?: number;

  @Field({ nullable: true })
  @IsNumber()
  totalNeedles?: number;

  @Field({ nullable: true })
  @MaxLength(50)
  yarnFeederType?: string;

  @Field({ nullable: true })
  @MaxLength(50)
  needleSensor?: string;

  @Field({ nullable: true })
  @IsNumber()
  capacityInM?: number;

  @Field({ nullable: true })
  @IsNumber()
  capacityInKg?: number;

  @Field({ nullable: true })
  @MaxLength(50)
  @IsIn(['Needle', 'Pin', ''])
  settingSystem?: string;

  @Field({ nullable: true })
  @IsNumber()
  totalChamber?: number;

  @Field({ nullable: true })
  @IsNumber()
  usableWidth?: number;

  @Field({ nullable: true })
  @IsNumber()
  nominalWidth?: number;

  @Field({ nullable: true })
  @MaxLength(50)
  @IsIn(['Front', 'Mid', ''])
  position?: string;

  @Field({ nullable: true })
  @MaxLength(50)
  capacity?: string;

  @Field({ nullable: true })
  @MaxLength(50)
  steamCapacity?: string;

  @Field({ nullable: true })
  @MaxLength(50)
  heatCapacity?: string;

  @Field({ nullable: true })
  @MaxLength(50)
  maxWorkingPressure?: string;

  @Field({ nullable: true })
  @MaxLength(50)
  freeAirDelivery?: string;
}
