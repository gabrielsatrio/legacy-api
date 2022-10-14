import { Field, Int, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ANG_EMPLOYEE_KHL_LINE_V')
@ObjectType()
export class AbsensiKhlDetailView extends BaseEntity {
  @Field(() => Int)
  @PrimaryColumn({ name: 'ID' })
  id!: number;

  @Field()
  @Column({ name: 'NRP' })
  nrp!: string;

  @Field()
  @Column({ name: 'NAME' })
  name!: string;

  @Field()
  @Column({ name: 'GRADE' })
  grade!: string;

  @Field()
  @Column({ name: 'ORG_ID' })
  orgId!: string;

  @Field()
  @Column({ name: 'ORG_NAME' })
  orgName!: string;

  @Field()
  @Column({ name: 'POS_ID' })
  posId!: string;

  @Field()
  @Column({ name: 'POS_NAME' })
  posName!: string;

  @Field(() => Int)
  @Column({ name: 'EMPLOYEE_KHL_ID' })
  employeeKhlId!: number;
}
