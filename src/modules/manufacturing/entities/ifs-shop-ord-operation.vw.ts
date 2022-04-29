import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('SHOP_ORDER_OPERATION')
@ObjectType()
export class IfsShopOrderOperationView extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'ORDER_NO' })
  orderNo!: string;

  @Field()
  @PrimaryColumn({ name: 'RELEASE_NO' })
  releaseNo!: string;

  @Field()
  @PrimaryColumn({ name: 'SEQUENCE_NO' })
  sequenceNo!: string;

  @Field()
  @PrimaryColumn({ name: 'OPERATION_NO' })
  operationNo!: number;

  @Field()
  @Column({ name: 'OPERATION_DESCRIPTION' })
  operationDescription!: string;

  @Field()
  @Column({ name: 'CONTRACT' })
  contract!: string;

  @Field()
  @Column({ name: 'WORK_CENTER_NO' })
  workCenterNo!: string;

  @Field()
  @Column({ name: 'PART_NO' })
  partNo!: string;

  @Field({ nullable: true })
  @Column({ name: 'LABOR_CLASS_NO' })
  laborClassNo?: string;

  @Field()
  @Column({ name: 'OBJID' })
  objId!: string;

  @Field()
  @Column({ name: 'OBJVERSION' })
  objVersion!: string;

  @Field()
  @Column({ name: 'OBJKEY' })
  objKey!: string;
}
