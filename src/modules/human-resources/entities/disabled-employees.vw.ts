import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ANG_DISABLED_EMPLOYEES_V')
@ObjectType()
export class DisabledEmployeesView extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'EMPLOYEE_ID' })
  employeeId!: string;

  @Field({ nullable: true })
  @Column({ name: 'DISPLAY_NAME' })
  displayName?: string;

  @Field({ nullable: true })
  @Column({ name: 'GRADE_ID' })
  gradeId?: string;

  @Field({ nullable: true })
  @Column({ name: 'COMPANY_OFFICE' })
  companyOffice?: string;

  @Field({ nullable: true })
  @Column({ name: 'DEPARTMENT' })
  department?: string;

  @Field({ nullable: true })
  @Column({ name: 'POSITION' })
  position?: string;
}
