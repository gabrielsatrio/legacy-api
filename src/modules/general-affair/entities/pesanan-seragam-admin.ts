import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Entity, PrimaryColumn } from 'typeorm';

@Entity('VKY_ADMIN_PESANAN_SERAGAM')
@ObjectType()
export class AdminPesananSeragam extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'EMPLOYEE_ID' })
  employeeId!: string;
}
