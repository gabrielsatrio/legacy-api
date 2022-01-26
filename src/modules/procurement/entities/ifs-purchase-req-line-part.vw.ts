import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('PURCHASE_REQ_LINE_PART')
@ObjectType()
export class IfsPurchaseReqLinePartView extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'REQUISITION_NO' })
  requisitionNo!: string;
  @Field()
  @PrimaryColumn({ name: 'LINE_NO' })
  lineNo!: string;

  @Field()
  @PrimaryColumn({ name: 'RELEASE_NO' })
  releaseNo!: string;

  @Field()
  @Column({ name: 'CONTRACT' })
  contract!: string;

  @Field({ nullable: true })
  @Column({ name: 'PART_NO' })
  partNo?: string;

  @Field({ nullable: true })
  @Column({ name: 'DESCRIPTION' })
  description?: string;

  @Field({ nullable: true })
  @Column({ name: 'ORIGINAL_QTY' })
  originalQty?: number;

  @Field({ nullable: true })
  @Column({ name: 'UNIT_MEAS' })
  unitMeas?: string;

  @Field({ nullable: true })
  @Column({ name: 'NOTE_TEXT' })
  noteText?: string;

  @Field()
  @Column({ name: 'OBJKEY' })
  objKey!: string;
}
