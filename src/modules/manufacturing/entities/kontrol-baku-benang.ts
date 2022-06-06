import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('GBR_KONTROL_BAKU_BENANG')
@ObjectType()
export class KontrolBakuBenang extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'ID' })
  id!: number;

  @Field()
  @Column({ name: 'CONTRACT' })
  contract!: string;

  @Field()
  @Column({ name: 'ORDER_NO' })
  orderNo!: string;

  @Field()
  @Column({ name: 'ORDER_TYPE' })
  orderType!: string;

  @Field()
  @Column({ name: 'DO_DATE' })
  doDate!: Date;

  @Field()
  @Column({ name: 'DIAMETER' })
  diameter!: string;

  @Field()
  @Column({ name: 'CREATED_BY' })
  createdBy!: string;

  @Field()
  @Column({ name: 'CREATED_AT' })
  createdAt!: Date;

  @Field()
  @Column({ name: 'UPDATED_AT' })
  updatedAt!: Date;
}
