import { Field, Int, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ANG_KASBON_LOG_V')
@ObjectType()
export class KasbonLogView extends BaseEntity {
  @Field(() => Int)
  @PrimaryColumn({ name: 'ID' })
  id!: number;

  @Field()
  @Column({ name: 'STATUS' })
  status!: string;

  @Field()
  @Column({ name: 'STATUS_DATE' })
  statusDate!: Date;

  @Field()
  @Column({ name: 'APPROVED_BY' })
  approvedBy!: string;

  @Field(() => Int)
  @Column({ name: 'KASBON_ID' })
  kasbonId!: number;
}
