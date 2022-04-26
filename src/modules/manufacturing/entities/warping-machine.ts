import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('GBR_WARPING_MACHINE')
@ObjectType()
export class WarpingMachine extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'MACHINE_ID' })
  machineId!: string;

  @Field({ nullable: true })
  @Column({ name: 'MACHINE_NAME' })
  machineName?: string;

  @Field({ nullable: true })
  @Column({ name: 'CONTRACT' })
  contract?: string;
}
