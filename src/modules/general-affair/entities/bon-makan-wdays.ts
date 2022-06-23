import { Field, Int, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ANG_BON_MAKAN_WDAYS_TAB')
@ObjectType()
export class BonMakanWeekdays extends BaseEntity {
  @Field(() => Int)
  @PrimaryColumn({ name: 'ID' })
  id!: number;

  @Field()
  @Column({ name: 'DEPT' })
  dept!: string;

  @Field()
  @Column({ name: 'PLANT' })
  plant!: string;

  @Field()
  @Column({ name: 'FROM_TANGGAL' })
  fromTanggal!: Date;

  @Field()
  @Column({ name: 'TO_TANGGAL' })
  toTanggal!: Date;

  @Field()
  @Column({ name: 'CREATED_BY' })
  createdBy!: string;
}
