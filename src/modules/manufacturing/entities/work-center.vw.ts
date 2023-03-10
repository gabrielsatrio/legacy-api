import { Field, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn
} from 'typeorm';
import { MachineView } from './apm-machine.vw';

@Entity('ATJ_WORK_CENTER_V')
@ObjectType()
export class WorkCenterView extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'CONTRACT' })
  contract!: string;

  @Field()
  @PrimaryColumn({ name: 'WORK_CENTER_NO' })
  workCenterNo!: string;

  @Field()
  @Column({ name: 'DESCRIPTION' })
  description!: string;

  @Field({ nullable: true })
  @Column({ name: 'DEPARTMENT_NO' })
  departmentNo?: string;

  @Field()
  @Column({ name: 'UOM' })
  uom!: string;

  @Field({ nullable: true })
  @Column({ name: 'USAGE_CODE' })
  usageCode?: string;

  @Field()
  @Column({ name: 'CREATE_DATE' })
  createDate!: Date;

  @Field()
  @Column({ name: 'OBJID' })
  objId!: string;

  @Field()
  altDescription(): string {
    return `${this.workCenterNo} - ${this.description}`;
  }

  @Field(() => MachineView, { nullable: true })
  @ManyToOne(() => MachineView, (machine) => machine.workCenters, {
    nullable: true
  })
  @JoinColumn({ name: 'CONTRACT', referencedColumnName: 'contract' })
  @JoinColumn({ name: 'WORK_CENTER_NO', referencedColumnName: 'workCenterNo' })
  machines?: MachineView;
}
