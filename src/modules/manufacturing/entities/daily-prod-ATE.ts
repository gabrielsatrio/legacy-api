import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('GBR_PROD_AT4E')
@ObjectType()
export class DailyProdATE extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'OBJID' })
  objId!: string;

  @Field()
  @Column({ name: 'CONTRACT' })
  contract!: string;

  @Field()
  @Column({ name: 'REPORT_DATE' })
  reportDate!: Date;

  @Field()
  @Column({ name: 'PART_NO' })
  partNo!: string;

  @Field()
  @Column({ name: 'PART_DESC' })
  partDesc!: string;

  @Field()
  @Column({ name: 'MACHINE' })
  machine!: string;

  @Field()
  @Column({ name: 'LOT_NO' })
  lotNo!: string;

  @Field()
  @Column({ name: 'GOOD_PRODUCT' })
  goodProduct!: number;

  @Field()
  @Column({ name: 'AFAL' })
  afal!: number;

  @Field()
  @Column({ name: 'PO_NO' })
  poNo!: string;

  @Field({ nullable: true })
  @Column({ name: 'KETERANGAN' })
  keterangan?: string;

  @Field()
  @Column({ name: 'ORDER_NO' })
  orderNo!: string;
}
