import { Field, Int, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ANG_RETUR_MAKAN_LINE_V')
@ObjectType()
export class ReturMakanDetailView extends BaseEntity {
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
  @Column({ name: 'BUDGET' })
  budget!: number;

  @Field()
  @Column({ name: 'PERMINTAAN' })
  permintaan!: number;

  @Field()
  @Column({ name: 'REALISASI' })
  realisasi!: number;

  @Field()
  @Column({ name: 'SELISIH' })
  selisih!: number;

  @Field(() => Int)
  @Column({ name: 'RETUR_MAKAN_ID' })
  returMakanId!: number;

  @Field()
  @Column({ name: 'BUDGET_SR' })
  budgetSr!: number;

  @Field()
  @Column({ name: 'PERMINTAAN_SR' })
  permintaanSr!: number;

  @Field()
  @Column({ name: 'REALISASI_SR' })
  realisasiSr!: number;

  @Field({ nullable: true })
  @Column({ name: 'DEPT_NAME' })
  deptName?: string;
}
