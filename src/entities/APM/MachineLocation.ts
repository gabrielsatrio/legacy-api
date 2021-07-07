import { Field, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity('ROB_APM_MACHINE_LOCATION')
@ObjectType()
export class MachineLocation extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'LOCATION_NO' })
  locationNo!: string;

  @Field()
  @PrimaryColumn({ name: 'CONTRACT' })
  contract!: string;

  @Field()
  @Column({ name: 'DESCRIPTION' })
  description!: string;

  @Field()
  @Column({ name: 'STATUS' })
  status!: string;

  @Field()
  @CreateDateColumn({ name: 'CREATED_AT' })
  createdAt!: Date;

  @Field()
  @UpdateDateColumn({ name: 'UPDATED_AT' })
  updatedAt!: Date;
}
