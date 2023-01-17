import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ANG_DISABLED_EMPLOYEES_V')
@ObjectType()
export class DisabledEmployeesView extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'EMPLOYEE_ID' })
  employeeId!: string;

  @Field()
  @Column({ name: 'DISPLAY_NAME' })
  displayName!: string;

  @Field()
  @Column({ name: 'GRADE_ID' })
  gradeId!: string;

  @Field()
  @Column({ name: 'COMPANY_OFFICE' })
  companyOffice!: string;

  @Field()
  @Column({ name: 'DEPARTMENT' })
  department!: string;

  @Field()
  @Column({ name: 'POSITION' })
  position!: string;
}
