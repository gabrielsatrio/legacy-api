import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('GBR_CEK_OPNAME_STATUS')
@ObjectType()
export class OpnameStatus extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'OBJID' })
  objId!: string;

  @Field()
  @Column({ name: 'CONTRACT' })
  contract!: string;

  @Field()
  @Column({ name: 'USERNAME' })
  username!: string;

  @Field()
  @Column({ name: 'PERIODE' })
  periode!: Date;

  @Field()
  @Column({ name: 'TIME' })
  time!: string;

  @Field()
  @Column({ name: 'STATUS' })
  status!: string;

  @Field()
  @Column({ name: 'DEPT' })
  dept!: string;

  @Field({ nullable: true })
  @Column({ name: 'OPNAME_TYPE' })
  opnameType?: string;

  @Field({ nullable: true })
  @Column({ name: 'NUM_OF_LOC' })
  numOfLoc?: number;

  @Field({ nullable: true })
  @Column({ name: 'LOCATION_NO' })
  locationNo?: string;
}
