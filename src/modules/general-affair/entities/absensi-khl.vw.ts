import { Field, Int, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ANG_EMPLOYEE_KHL_V')
@ObjectType()
export class AbsensiKhlView extends BaseEntity {
  @Field(() => Int)
  @PrimaryColumn({ name: 'ID' })
  id!: number;

  @Field()
  @Column({ name: 'PLANT' })
  plant!: string;

  @Field()
  @Column({ name: 'DEPT_CODE' })
  deptCode!: string;

  @Field()
  @Column({ name: 'DEPT_NAME' })
  deptName!: string;

  @Field()
  @Column({ name: 'TANGGAL' })
  tanggal!: Date;

  @Field({ defaultValue: false })
  @PrimaryColumn({ name: 'IS_DUPLICATE' })
  isDuplicate!: boolean;

  @Field(() => Int)
  @PrimaryColumn({ name: 'DUPLICATE_ID' })
  duplicateId!: number;

  @Field()
  @Column({ name: 'CREATED_BY' })
  createdBy!: string;
}
