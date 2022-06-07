import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ROB_APM_TASK')
@ObjectType()
export class MtcTask extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'TASK_ID' })
  taskId!: string;

  @Field()
  @Column({ name: 'DESCRIPTION' })
  description!: string;

  @Field()
  @Column({ name: 'TYPE' })
  type!: string;

  @Field({ nullable: true })
  @Column({ name: 'UOM' })
  uom?: string;

  @Field()
  @Column({ name: 'STATUS' })
  status!: string;

  @Field()
  @Column({ name: 'CREATED_AT' })
  createdAt!: Date;

  @Field()
  @Column({ name: 'UPDATED_AT' })
  updatedAt!: Date;
}
