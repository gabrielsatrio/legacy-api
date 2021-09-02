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
}
