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

@Entity('WORK_CENTER')
@ObjectType()
export class IfsWorkCenterView extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'WORK_CENTER_NO' })
  workCenterNo!: string;

  @Field()
  @PrimaryColumn({ name: 'CONTRACT' })
  contract!: string;

  @Field()
  @Column({ name: 'DESCRIPTION' })
  description!: string;

  @Field({ nullable: true })
  @Column({ name: 'DEPARTMENT_NO' })
  departmentNo?: string;

  @Field()
  @Column({ name: 'OBJID' })
  objId!: string;

  @Field()
  altDescription(): string {
    return `${this.description} (${this.workCenterNo})`;
  }

  @Field(() => MachineView, { nullable: true })
  @ManyToOne(() => MachineView, (machine) => machine.workCenters, {
    nullable: true
  })
  @JoinColumn({ name: 'CONTRACT', referencedColumnName: 'contract' })
  @JoinColumn({ name: 'WORK_CENTER_NO', referencedColumnName: 'workCenterNo' })
  machines?: MachineView;
}
