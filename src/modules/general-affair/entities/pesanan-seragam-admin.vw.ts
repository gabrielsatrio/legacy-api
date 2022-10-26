import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('VKY_ADMIN_PESANAN_SERAGAM_V')
@ObjectType()
export class AdminPesananSeragamView extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'EMPLOYEE_ID' })
  employeeId!: string;

  @Field()
  @Column({ name: 'NAME' })
  name!: string;

  @Field({ nullable: true })
  @Column({ name: 'DEPARTMENT_ID' })
  departmentId?: string;

  @Field({ nullable: true })
  @Column({ name: 'DEPARTMENT' })
  department?: string;

  @Field({ nullable: true })
  @Column({ name: 'COMPANY_OFFICE' })
  companyOffice?: string;
}
