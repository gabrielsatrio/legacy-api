import { Field, Int, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ANG_EMPLOYEE_KHL_LINE')
@ObjectType()
export class AbsensiKhlDetail extends BaseEntity {
  @Field(() => Int)
  @PrimaryColumn({ name: 'ID' })
  id!: number;

  @Field()
  @Column({ name: 'NRP' })
  nrp!: string;

  @Field(() => Int)
  @Column({ name: 'EMPLOYEE_KHL_ID' })
  employeeKhlId!: number;
}
