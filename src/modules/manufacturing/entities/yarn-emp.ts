import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('GBR_YARN_EMP')
@ObjectType()
export class YarnEmp extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'EMPLOYEE_ID' })
  employeeId!: string;

  @Field()
  @Column({ name: 'GRADE_ID' })
  gradeId!: string;

  @Field()
  @Column({ name: 'ORG_ID' })
  orgId!: string;

  @Field()
  @Column({ name: 'ORG_NAME' })
  orgName!: string;

  @Field()
  @Column({ name: 'POSITION_ID' })
  positionId!: string;

  @Field()
  @Column({ name: 'POS_NAME' })
  posName!: string;

  @Field()
  @Column({ name: 'COMPANY_ID' })
  companyId!: string;

  @Field()
  @Column({ name: 'DISPLAY_NAME' })
  displayName!: string;

  @Field()
  @Column({ name: 'EMAIL' })
  email!: string;
}
