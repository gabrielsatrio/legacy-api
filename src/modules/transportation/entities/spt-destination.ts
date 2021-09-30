import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('GBR_SPT_DESTINATION_TAB')
@ObjectType()
export class Destination extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'DESTINATION_ID' })
  destinationId!: string;

  @Field()
  @Column({ name: 'DESTINATION_NAME' })
  destinationName!: string;
}
