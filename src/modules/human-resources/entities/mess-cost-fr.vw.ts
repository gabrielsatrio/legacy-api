import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('VKY_MESS_COST_FIX_RATE_V')
@ObjectType()
export class MessCostFixRateView extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'ID' })
  id!: number;

  @Field()
  @Column({ name: 'MESS' })
  mess!: string;

  @Field()
  @Column({ name: 'VALID_FROM' })
  valid_from!: Date;

  @Field()
  @Column({ name: 'VALID_TO' })
  valid_to!: Date;

  @Field()
  @Column({ name: 'SUBSIDI_TDL' })
  subsidi_tdl!: number;

  @Field()
  @Column({ name: 'SUBSIDI_BEA_BEBAN' })
  subsidi_bea_beban!: number;

  @Field()
  @Column({ name: 'SUBSIDI_BEA_ADM' })
  subsidi_bea_adm!: number;

  @Field()
  @Column({ name: 'TAMU_PERUSAHAAN' })
  tamu_perusahaan!: number;

  @Field()
  @Column({ name: 'TAMU_PRIBADI' })
  tamu_pribadi!: number;

  @Field()
  @Column({ name: 'INTERNET' })
  internet!: number;

  @Field()
  @Column({ name: 'CREATED_BY' })
  created_by!: string;
}
