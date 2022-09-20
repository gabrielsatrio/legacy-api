import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('VKY_SOPIR_DIREKSI')
@ObjectType()
export class SopirDireksi extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'ID' })
  id!: number;

  @Field()
  @Column({ name: 'EMPLOYEE_ID' })
  employeeId!: string;
}
