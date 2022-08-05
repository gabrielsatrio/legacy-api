import { Field, Int, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ANG_BON_MAKAN_WDAYS_V')
@ObjectType()
export class BonMakanWeekdaysView extends BaseEntity {
  @Field(() => Int)
  @PrimaryColumn({ name: 'ID' })
  id!: number;

  @Field()
  @Column({ name: 'DEPT' })
  dept!: string;

  @Field()
  @PrimaryColumn({ name: 'PLANT' })
  plant!: string;

  @Field()
  @PrimaryColumn({ name: 'FROM_TANGGAL' })
  fromTanggal!: Date;

  @Field()
  @PrimaryColumn({ name: 'TO_TANGGAL' })
  toTanggal!: Date;

  @Field()
  @Column({ name: 'CREATED_BY' })
  createdBy!: string;

  @Field({ nullable: true })
  @Column({ name: 'DEPT_NAME' })
  deptName?: string;
}
