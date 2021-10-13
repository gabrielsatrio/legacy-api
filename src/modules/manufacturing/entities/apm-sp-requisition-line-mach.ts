import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ROB_APM_SPART_REQ_LINE_MACH')
@ObjectType()
export class SparePartReqLineMach extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'REQUISITION_ID' })
  requisitionId!: string;

  @Field()
  @PrimaryColumn({ name: 'LINE_ITEM_NO' })
  lineItemNo!: number;

  @Field()
  @PrimaryColumn({ name: 'MAP_NO' })
  mapNo!: number;

  @Field()
  @Column({ name: 'MACHINE_ID' })
  machineId!: string;

  @Field()
  @Column({ name: 'CONTRACT' })
  contract!: string;

  @Field({ defaultValue: 0 })
  @Column({ name: 'QUANTITY' })
  quantity!: number;

  @Field()
  @Column({ name: 'CREATED_AT' })
  createdAt!: Date;

  @Field()
  @Column({ name: 'UPDATED_AT' })
  updatedAt!: Date;
}
