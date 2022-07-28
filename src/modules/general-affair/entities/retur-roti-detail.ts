import { Field, Int, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ANG_RETUR_ROTI_LINE_TAB')
@ObjectType()
export class ReturRotiDetail extends BaseEntity {
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
  @Column({ name: 'PERMINTAAN_ROTI_BSR' })
  pRotiBesar!: number;

  @Field()
  @Column({ name: 'PERMINTAAN_ROTI_KCL' })
  pRotiKecil!: number;

  @Field()
  @Column({ name: 'RETUR_ROTI_BSR' })
  rtrRotiBesar!: number;

  @Field()
  @Column({ name: 'RETUR_ROTI_KCL' })
  rtrRotiKecil!: number;

  @Field()
  @Column({ name: 'REALISASI_ROTI_BSR' })
  rRotiBesar!: number;

  @Field()
  @Column({ name: 'REALISASI_ROTI_KCL' })
  rRotiKecil!: number;

  @Field(() => Int)
  @Column({ name: 'RETUR_ROTI_ID' })
  returRotiId!: number;

  @Field({ nullable: true })
  @Column({ name: 'DEPT_NAME' })
  deptName?: string;
}
