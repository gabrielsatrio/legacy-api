import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('GBR_GIS_EMP')
@ObjectType()
export class GisEmp extends BaseEntity {
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
  @Column({ name: 'JOB_ID' })
  jobId!: string;

  @Field()
  @Column({ name: 'JOB_TITLE' })
  jobTitle!: string;

  @Field()
  @Column({ name: 'ORGANIZATION_ID' })
  organizationId!: string;

  @Field()
  @Column({ name: 'ORGANIZATION_NAME' })
  organizationName!: string;

  @Field({ nullable: true })
  @Column({ name: 'DEPARTMENT_ID' })
  departmentId?: string;

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

  @Field()
  displayName(): string {
    return `${this.name} (${this.employeeId})`;
  }
}
