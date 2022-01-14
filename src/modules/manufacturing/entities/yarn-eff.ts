import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('GBR_YARN_EFF')
@ObjectType()
export class YarnEff extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'OBJID' })
  objId!: string;

  @Field()
  @Column({ name: 'CONTRACT' })
  contract!: string;

  @Field()
  @Column({ name: 'REPORT_DATE' })
  reportDate!: Date;

  @Field()
  @Column({ name: 'EMPLOYEE_ID' })
  employeeId!: string;

  @Field()
  @Column({ name: 'SHIFT' })
  shift!: string;

  @Field()
  @Column({ name: 'MACHINE' })
  machine!: string;

  @Field()
  @Column({ name: 'YARN_TYPE' })
  yarnType!: string;

  @Field()
  @Column({ name: 'GRADE_A' })
  gradeA!: number;

  @Field()
  @Column({ name: 'GRADE_B' })
  gradeB!: number;

  @Field()
  @Column({ name: 'AFAL' })
  afal!: number;
}
