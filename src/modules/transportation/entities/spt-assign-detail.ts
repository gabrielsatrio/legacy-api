import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Entity, PrimaryColumn } from 'typeorm';

@Entity('GBR_SPT_ASSIGN_DETAIL_TAB')
@ObjectType()
export class AssignDetail extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'ASSIGN_ID' })
  assignId!: string;

  @Field()
  @PrimaryColumn({ name: 'ASSIGN_DATE' })
  assignDate!: Date;

  @Field()
  @PrimaryColumn({ name: 'REQ_NO' })
  reqNo!: number;

  @Field()
  @PrimaryColumn({ name: 'REQUISITION_DATE' })
  requisitionDate!: Date;

  // @Field()
  // @Column({ name: 'EXPEDITION_ID' })
  // expeditionId?: string;

  // @Field()
  // @Column({ name: 'VEHICLE_ID' })
  // vehicleId?: string;

  // @Field()
  // @Column({ name: 'LICENSE_PLATE' })
  // licensePlate?: string;

  // @Field()
  // @Column({ name: 'DRIVER_NAME' })
  // driverName?: string;

  // @Field()
  // @Column({ name: 'NOMOR_RESI' })
  // nomorResi?: string;

  // @Field()
  // @Column({ name: 'IS_NORMAL_PRICE' })
  // isNormalPrice?: string;

  // @Field()
  // @Column({ name: 'TOTAL_PRICE' })
  // totalPrice?: number;

  // @Field()
  // @Column({ name: 'NOPOL_LANGSIR' })
  // nopolLangsir?: string;
}
