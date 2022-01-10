import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('INTERNAL_DESTINATION_LOV')
@ObjectType()
export class IfsInternalDestinationView extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'DESTINATION_ID' })
  destinationId!: string;

  @Field()
  @PrimaryColumn({ name: 'CONTRACT' })
  contract!: string;

  @Field()
  @Column({ name: 'DESCRIPTION' })
  description!: string;

  @Field()
  @Column({ name: 'OBJKEY' })
  objKey!: string;
}
