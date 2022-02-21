import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('GBR_INSPEK_QC')
@ObjectType()
export class InspekQc extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'ID' })
  id!: number;

  @Field()
  @Column({ name: 'CONTRACT' })
  contract!: string;

  @Field()
  @Column({ name: 'TGL' })
  tgl!: Date;

  @Field()
  @Column({ name: 'SHIFT1' })
  shift1!: number;

  @Field()
  @Column({ name: 'SHIFT2' })
  shift2!: number;

  @Field()
  @Column({ name: 'SHIFT3' })
  shift3!: number;

  @Field()
  @Column({ name: 'REALISASI' })
  realisasi!: number;

  @Field({ nullable: true })
  @Column({ name: 'KETERANGAN' })
  keterangan?: string;

  @Field()
  @Column({ name: 'CREATED_AT' })
  createdAt!: Date;

  @Field()
  @Column({ name: 'CREATED_BY' })
  createdBy!: string;
}
