import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('GBR_INSPEK_SPEED')
@ObjectType()
export class InspekQcSpeed extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'ID' })
  id!: number;

  @Field()
  @Column({ name: 'CONTRACT' })
  contract!: string;

  @Field()
  @Column({ name: 'TGL' })
  tgl!: Date;

  @Field()
  @Column({ name: 'REAL_SPEED_TN' })
  realSpeedTn!: number;

  @Field()
  @Column({ name: 'REAL_SPEED_RJ' })
  realSpeedRj!: number;

  @Field({ nullable: true })
  @Column({ name: 'KETERANGAN' })
  keterangan?: string;
}
