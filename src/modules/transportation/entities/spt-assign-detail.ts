import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('GBR_SPT_ASSIGN_DETAIL_TAB')
@ObjectType()
export class AssignDetail extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'ASSIGN_ID' })
  assignID!: string;

  @Field()
  @PrimaryColumn({ name: 'ASSIGN_DATE' })
  assignDate!: Date;

  @Field()
  @Column({ name: 'REQ_NO' })
  type!: string;
}
