import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('CONDITION_CODE')
@ObjectType()
export class ConditionCodeView extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'CONDITION_CODE' })
  conditionCode!: string;

  @Field({ nullable: true })
  @Column({ name: 'DESCRIPTION' })
  description?: string;

  @Field({ nullable: true })
  @Column({ name: 'NOTE_TEXT' })
  noteText?: string;

  @Field({ nullable: true })
  @Column({ name: 'CONDITION_CODE_TYPE' })
  conditionCodeType?: string;

  @Field()
  @Column({ name: 'CONDITION_CODE_TYPE_DB' })
  conditionCodeTypeDb!: string;

  @Field({ nullable: true })
  @Column({ name: 'DEFAULT_AVAIL_CONTROL_ID' })
  defaultAvailControlId?: string;

  @Field({ nullable: true })
  @Column({ name: 'OBJID' })
  objid?: string;

  @Field({ nullable: true })
  @Column({ name: 'OBJVERSION' })
  objversion?: string;

  @Field({ nullable: true })
  @Column({ name: 'OBJKEY' })
  objkey?: string;
}
