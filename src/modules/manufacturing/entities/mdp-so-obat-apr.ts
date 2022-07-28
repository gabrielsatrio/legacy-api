import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { GraphQLDate } from '../../core/entities/scalars';
import { SoObatAprMaterial } from './mdp-so-obat-apr-mat';

@Entity('CHR_SO_OBAT_APR')
@ObjectType()
export class SoObatApr extends BaseEntity {
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

  @Field({ nullable: true })
  @Column({ name: 'STATUS' })
  status?: string;

  @Field(() => [SoObatAprMaterial], { nullable: true })
  @OneToMany(
    () => SoObatAprMaterial,
    (SoObatAprMaterial) => SoObatAprMaterial.master,
    {
      nullable: true
    }
  )
  details?: SoObatAprMaterial[];
}
