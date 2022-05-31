import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ANG_RETUR_MAKAN_LINE_TAB')
@ObjectType()
export class ReturMakanDetail extends BaseEntity {
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

  @Field()
  @Column({ name: 'RETUR_MAKAN_ID' })
  returMakanId!: number;
}
