import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('VKY_PESANAN_SERAGAM_ADMIN_V')
@ObjectType()
export class PesananSeragamAdminView extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'EMPLOYEE_ID' })
  employeeId!: string;

  @Field()
  @Column({ name: 'NAME' })
  name!: string;

  @Field({ nullable: true })
  @Column({ name: 'ALLOWED_SITE' })
  allowedSite?: string;

  @Field({ nullable: true })
  @Column({ name: 'ALLOWED_DEPARTMENT' })
  allowedDepartment?: string;
}
