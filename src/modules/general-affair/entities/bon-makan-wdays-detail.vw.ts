import { Field, Int, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ANG_BON_MAKAN_WDAYS_LINE_V')
@ObjectType()
export class BonMakanWeekdaysDetailView extends BaseEntity {
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
  @Column({ name: 'TANGGAL' })
  tanggal!: Date;

  @Field()
  @Column({ name: 'GRADE' })
  grade!: string;

  @Field({ nullable: true })
  @Column({ name: 'SG_ROTI_12' })
  sgRoti12?: number;

  @Field({ nullable: true })
  @Column({ name: 'PG_ROTI_BESAR' })
  pgRotiBesar?: number;

  @Field({ nullable: true })
  @Column({ name: 'PG_ROTI_KECIL' })
  pgRotiKecil?: number;

  @Field({ nullable: true })
  @Column({ name: 'SG_NASI' })
  sgNasi?: number;

  @Field({ nullable: true })
  @Column({ name: 'SG_ROTI_BESAR' })
  sgRotiBesar?: number;

  @Field({ nullable: true })
  @Column({ name: 'SG_ROTI_KECIL' })
  sgRotiKecil?: number;

  @Field({ nullable: true })
  @Column({ name: 'ML_NASI' })
  mlNasi?: number;

  @Field({ nullable: true })
  @Column({ name: 'ML_ROTI_BESAR' })
  mlRotiBesar?: number;

  @Field({ nullable: true })
  @Column({ name: 'ML_ROTI_KECIL' })
  mlRotiKecil?: number;

  @Field({ nullable: true })
  @Column({ name: 'ML_ROTI_12' })
  mlRoti12?: number;

  @Field(() => Int)
  @Column({ name: 'BON_MAKAN_WDAYS_ID' })
  bonMakanWdaysId!: number;
}
