import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('GBR_SPT_SURAT_JALAN_V')
@ObjectType()
export class SuratJalan extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'REQ_NO' })
  reqNo!: string;

  @Field()
  @Column({ name: 'CONTRACT' })
  contract!: string;

  @Field()
  @Column({ name: 'DESTINATION_ID' })
  destinationId!: string;

  @Field()
  @Column({ name: 'DESTINATION_NAME' })
  destinationName!: string;

  @Field()
  @Column({ name: 'CUSTOMER_ID' })
  customerId!: string;

  @Field()
  @Column({ name: 'CUSTOMER_NAME' })
  customerName!: string;

  @Field()
  @PrimaryColumn({ name: 'REQUISITION_DATE' })
  requisitionDate!: Date;

  @Field()
  @Column({ name: 'ROLL_QTY' })
  rollQty!: number;

  @Field()
  @Column({ name: 'METER' })
  meter!: number;

  @Field()
  @Column({ name: 'WEIGHT' })
  weight!: number;

  @Field()
  @Column({ name: 'VOLUME' })
  volume!: number;

  @Field({ nullable: true })
  @Column({ name: 'NOTES' })
  notes?: string;

  @Field({ nullable: true })
  @Column({ name: 'EXPEDITION_ID' })
  expeditionId?: string;

  @Field({ nullable: true })
  @Column({ name: 'EXPEDITION_NAME' })
  expeditionName?: string;

  @Field({ nullable: true })
  @Column({ name: 'VEHICLE_NAME' })
  vehicleName?: string;

  @Field({ nullable: true })
  @Column({ name: 'LICENSE_PLATE' })
  licensePlate?: string;

  @Field({ nullable: true })
  @Column({ name: 'DRIVER_NAME' })
  driverName?: string;

  @Field({ nullable: true })
  @Column({ name: 'NOMOR_RESI' })
  nomorResi?: string;

  @Field({ nullable: true })
  @Column({ name: 'IS_NORMAL_PRICE' })
  isNormalPrice?: string;

  @Field({ nullable: true })
  @Column({ name: 'TOTAL_PRICE' })
  totalPrice?: number;

  @Field({ nullable: true })
  @Column({ name: 'NOPOL_LANGSIR' })
  nopolLangsir?: string;
}
