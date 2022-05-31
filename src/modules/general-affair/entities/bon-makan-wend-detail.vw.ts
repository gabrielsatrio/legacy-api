import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ANG_BON_MAKAN_WEND_LINE_V')
@ObjectType()
export class BonMakanWeekendDetailView extends BaseEntity {
  @Field()
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
  @Column({ name: 'NRP' })
  nrp!: string;

  @Field()
  @Column({ name: 'NAMA' })
  nama!: string;

  @Field()
  @Column({ name: 'SG_REALISASI' })
  sgRealisasi!: string;

  @Field()
  @Column({ name: 'SG_MAKAN' })
  sgMakan!: string;

  @Field({ nullable: true })
  @Column({ name: 'SG_KETERANGAN' })
  sgKeterangan?: string;

  @Field()
  @Column({ name: 'ML_REALISASI' })
  mlRealisasi!: string;

  @Field()
  @Column({ name: 'ML_MAKAN' })
  mlMakan!: string;

  @Field({ nullable: true })
  @Column({ name: 'ML_KETERANGAN' })
  mlKeterangan?: string;

  @Field()
  @Column({ name: 'BON_MAKAN_WEND_ID' })
  bonMakanWendId!: number;
}
