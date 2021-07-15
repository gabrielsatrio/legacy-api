import {
  IsDate,
  IsIn,
  IsNumber,
  Length,
  MaxLength,
  MinLength
} from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { Machine } from '../../../entities/Machine';

@InputType()
export class MachineInput implements Partial<Machine> {
  @Field()
  @MinLength(6)
  machineId!: string;

  @Field()
  @Length(3, 4)
  contract!: string;

  @Field()
  @Length(1, 500)
  description!: string;

  @Field()
  @MinLength(4)
  categoryId!: string;

  @Field()
  @Length(1, 15)
  type!: string;

  @Field()
  @MinLength(2)
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
  @MinLength(3)
  departmentId!: string;

  @Field()
  @Length(3, 10)
  locationNo!: string;

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
  @MaxLength(50)
  controller?: string;

  @Field({ nullable: true })
  @MaxLength(50)
  launchMethod?: string;

  @Field({ nullable: true })
  @MaxLength(50)
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
  position?: string;
}
