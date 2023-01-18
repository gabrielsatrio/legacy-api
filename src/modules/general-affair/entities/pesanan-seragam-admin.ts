import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('VKY_PESANAN_SERAGAM_ADMIN')
@ObjectType()
export class PesananSeragamAdmin extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'EMPLOYEE_ID' })
  employeeId!: string;

  @Field({ nullable: true })
  @Column({ name: 'ALLOWED_SITE' })
  allowedSite?: string;

  @Field({ nullable: true })
  @Column({ name: 'ALLOWED_DEPARTMENT' })
  allowedDepartment?: string;
}
