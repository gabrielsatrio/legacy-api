import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('VKY_KP_OEM_SEMENTARA')
@ObjectType()
export class KpOemSementara extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'CONTRACT' })
  contract!: string;

  @Field()
  @PrimaryColumn({ name: 'ORDER_NO' })
  orderNo!: string;

  @Field()
  @PrimaryColumn({ name: 'LOT_BATCH_NO' })
  lotBatchNo!: string;

  @Field({ nullable: true })
  @Column({ name: 'SERI_BEAM' })
  seriBeam?: string;

  @Field()
  @Column({ name: 'PICK_AWAL' })
  pickAwal!: number;

  @Field()
  @Column({ name: 'PICK_AKHIR' })
  pickAkhir!: number;

  @Field()
  @Column({ name: 'STATUS' })
  status!: string;

  @Field()
  @Column({ name: 'CREATED_DATE' })
  createdDate!: Date;

  @Field()
  @Column({ name: 'CREATED_AT' })
  createdAt!: string;

  @Field()
  @Column({ name: 'MODIFIED_DATE' })
  modifiedDate!: Date;

  @Field()
  @Column({ name: 'MODIFIED_AT' })
  modifiedAt!: string;
}
