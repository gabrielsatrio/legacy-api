import { Field, Int, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ANG_FAKTUR_PAJAK')
@ObjectType()
export class FakturPajak extends BaseEntity {
  @Field(() => Int)
  @PrimaryColumn({ name: 'ID' })
  id!: number;

  @Field({ nullable: true })
  @Column({ name: 'KODE_FAKTUR_A' })
  kodeFakturA?: string;

  @Field({ nullable: true })
  @Column({ name: 'KODE_FAKTUR_B' })
  kodeFakturB?: string;

  @Field({ nullable: true })
  @Column({ name: 'KODE_FAKTUR_C' })
  kodeFakturC?: string;

  @Field({ nullable: true })
  @Column({ name: 'CONTRACT' })
  contract?: string;

  @Field({ nullable: true })
  @Column({ name: 'ASSOCIATION_NO' })
  associationNo?: string;

  @Field({ nullable: true })
  @Column({ name: 'CUSTOMER_NO' })
  customerNo?: string;

  @Field({ nullable: true })
  @Column({ name: 'CUSTOMER_NAME' })
  customerName?: string;

  @Field({ nullable: true })
  @Column({ name: 'DATE_DELIVERED' })
  dateDelivered?: Date;

  @Field({ nullable: true })
  @Column({ name: 'NO_SJ' })
  noSj?: string;
}
