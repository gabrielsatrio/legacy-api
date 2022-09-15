import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { GraphQLDate } from '../../core/entities/scalars';
import { SoObatProsesMaterial } from './mdp-so-obat-proses-mat';

@Entity('CHR_SO_OBAT_PROSES')
@ObjectType()
export class SoObatProses extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'ORDER_NO' })
  orderNo!: string;

  @Field()
  @Column({ name: 'CONTRACT' })
  contract!: string;

  @Field()
  @Column({ name: 'PART_NO' })
  partNo!: string;

  @Field(() => GraphQLDate)
  @Column({ name: 'NEED_DATE' })
  needDate!: Date;

  @Field()
  @Column({ name: 'QTY' })
  qty!: number;

  @Field()
  @Column({ name: 'ALTERNATE' })
  alternativeNo!: string;

  @Field({ nullable: true })
  @Column({ name: 'NOTE' })
  note?: string;

  @Field()
  @Column({ name: 'TIPE' })
  tipe!: string;

  @Field()
  @Column({ name: 'MESIN' })
  mesin!: string;

  @Field({ nullable: true })
  @Column({ name: 'DRUM' })
  drum?: number;

  @Field({ nullable: true })
  @Column({ name: 'QTY_DRUM' })
  qtyDrum?: number;

  @Field()
  @Column({ name: 'DESCRIPTION' })
  description!: string;

  @Field(() => [SoObatProsesMaterial], { nullable: true })
  @OneToMany(
    () => SoObatProsesMaterial,
    (SoObatProsesMaterial) => SoObatProsesMaterial.master,
    {
      nullable: true
    }
  )
  details?: SoObatProsesMaterial[];
}
