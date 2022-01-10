import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ATJ_EMPLOYEE_MV')
@ObjectType()
export class EmployeeView extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'EMPLOYEE_ID' })
  employeeId!: string;

  @Field()
  @Column({ name: 'NAME' })
  name!: string;

  @Field()
  @Column({ name: 'EMAIL' })
  email!: string;

  @Field()
  @Column({ name: 'JOB_TITLE' })
  jobTitle!: string;

  @Field()
  @Column({ name: 'GRADE' })
  grade!: number;

  @Field()
  @Column({ name: 'WORK_LOCATION' })
  workLocation!: string;

  @Field({ nullable: true })
  @Column({ name: 'SUPERVISOR_LV_1' })
  supervisorLv1?: string;

  @Field({ nullable: true })
  @Column({ name: 'SUPERVISOR_LV_2' })
  supervisorLv2?: string;
}
