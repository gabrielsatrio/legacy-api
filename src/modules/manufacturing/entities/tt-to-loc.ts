import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ATJ_TO_LOC_TT')
@ObjectType()
export class ToLocTt extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'LOCATION_TO' })
  locationNo!: string;

  @Field()
  @PrimaryColumn({ name: 'DEPT' })
  dept!: string;

  @Field()
  @Column({ name: 'CONTRACT' })
  contract!: string;

  @Field()
  @Column({ name: 'OBJ_ID' })
  objId!: string;
}
