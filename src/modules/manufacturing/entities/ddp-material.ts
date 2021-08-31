import { Field, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn
} from 'typeorm';
import { MaterialUse } from './ddp-material-use';

@Entity('CHR_DDT_MATERIAL')
@ObjectType()
export class Material extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'CONTRACT' })
  contract!: string;

  @Field()
  @Column({ name: 'JENIS_CELUP' })
  jenisCelup!: string;

  @Field()
  @PrimaryColumn({ name: 'ID_NO', update: false })
  idNo!: string;

  @Field({ nullable: true })
  @CreateDateColumn({ name: 'TANGGAL' })
  tanggal?: Date;

  @Field()
  @Column({ name: 'PART_NO' })
  partNo!: string;

  @Field({ nullable: true })
  @Column({ name: 'MEDIA_CELUP' })
  mediaCelup?: string;

  @Field()
  @Column({ name: 'HASIL_COUNTER_METER' })
  hasilCounterMeter!: number;

  @Field({ nullable: true })
  @Column({ name: 'ORDER_NO' })
  orderNo?: string;

  @Field()
  @Column({ name: 'NO_MESIN' })
  noMesin!: string;

  @Field({ nullable: true })
  @Column({ name: 'JML_MEDIA_CELUP' })
  jmlMediaCelup?: string;

  @Field()
  @Column({ name: 'TARA' })
  tara!: number;

  @Field()
  @Column({ name: 'BRUTO' })
  bruto!: number;

  @Field()
  @Column({ name: 'NETTO' })
  netto!: number;

  @Field({ nullable: true })
  @Column({ name: 'NOTE' })
  note?: string;

  @Field()
  @Column({ name: 'LOT_CELUP' })
  lotCelup!: string;

  @Field({ nullable: true })
  deleteStatus?: string;

  @Field(() => [MaterialUse], { nullable: true })
  @OneToMany(() => MaterialUse, (materialUse) => materialUse.material, {
    nullable: true
  })
  materialUses?: MaterialUse[];
}
