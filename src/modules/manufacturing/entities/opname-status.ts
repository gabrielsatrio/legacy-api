import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('GBR_CEK_OPNAME_STATUS')
@ObjectType()
export class OpnameStatus extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'CONTRACT' })
  contract!: string;

  @Field()
  @PrimaryColumn({ name: 'USERNAME' })
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
}
