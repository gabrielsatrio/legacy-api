import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('VKY_MESS_COST_FIX_RATE')
@ObjectType()
export class MessCostFixRate extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'ID' })
  id!: number;

  @Field()
  @Column({ name: 'MESS' })
  mess!: string;

  @Field({ nullable: true })
  @Column({ name: 'VALID_FROM' })
  validFrom?: Date;

  @Field({ nullable: true })
  @Column({ name: 'VALID_TO' })
  validTo?: Date;

  @Field()
  @Column({ name: 'SUBSIDI_TDL' })
  subsidiTdl!: number;

  @Field()
  @Column({ name: 'SUBSIDI_BEA_BEBAN' })
  subsidiBeaBeban!: number;

  @Field()
  @Column({ name: 'SUBSIDI_BEA_ADM' })
  subsidiBeaAdm!: number;

  @Field()
  @Column({ name: 'TAMU_PERUSAHAAN' })
  tamuPerusahaan!: number;

  @Field()
  @Column({ name: 'TAMU_PRIBADI' })
  tamuPribadi!: number;

  @Field()
  @Column({ name: 'INTERNET' })
  internet!: number;

  @Field()
  @Column({ name: 'CREATED_BY' })
  createdBy!: string;
}
