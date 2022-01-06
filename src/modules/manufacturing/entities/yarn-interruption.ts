import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('GBR_YARN_INTERRUPTION')
@ObjectType()
export class YarnInterruption extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'INTERRUPTION_ID' })
  interruptionId!: string;

  @Field()
  @Column({ name: 'CONTRACT' })
  contract!: string;

  @Field()
  @Column({ name: 'INTERRUPTION' })
  interruption!: string;
}
