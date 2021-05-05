import { Field, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity('ROB_MACHINE')
@ObjectType()
export class Machine extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'MACHINE_ID' })
  machineId!: string;

  @Field()
  @Column({ name: 'MACHINE_NAME' })
  machineName!: string;

  @Field()
  @Column({ name: 'MACHINE_TYPE' })
  machineType!: string;

  @Field()
  @Column({ name: 'MAKER_ID' })
  makerId!: string;

  @Field()
  @Column({ name: 'YEAR_MADE' })
  yearMade!: number;

  @Field()
  @Column({ name: 'SERIAL_NO' })
  serialNo!: string;

  @Field({ nullable: true })
  @Column({ name: 'CONTROLLER' })
  controller!: string;

  @Field({ nullable: true })
  @Column({ name: 'LAUNCH_METHOD' })
  launchMethod!: string;

  @Field({ nullable: true })
  @Column({ name: 'IMAGE' })
  image!: string;

  @Field()
  @Column({ name: 'IS_ACTIVE' })
  isActive!: boolean;

  @Field({ nullable: true })
  @Column({ name: 'REMARKS' })
  remarks!: string;

  @Field()
  @Column({ name: 'CREATED_BY' })
  createdBy!: string;

  @Field()
  @CreateDateColumn({ name: 'CREATED_AT' })
  createdAt!: Date;

  @Field()
  @UpdateDateColumn({ name: 'UPDATED_AT' })
  updatedAt!: Date;
}
