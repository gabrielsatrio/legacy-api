import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('GBR_INSPEK_MESIN')
@ObjectType()
export class InspekQcMesin extends BaseEntity {
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
  @Column({ name: 'TN_SHIFT1' })
  tnShift1!: number;

  @Field()
  @Column({ name: 'TN_SHIFT2' })
  tnShift2!: number;

  @Field()
  @Column({ name: 'TN_SHIFT3' })
  tnShift3!: number;

  @Field()
  @Column({ name: 'RJ_SHIFT1' })
  rjShift1!: number;

  @Field()
  @Column({ name: 'RJ_SHIFT2' })
  rjShift2!: number;

  @Field()
  @Column({ name: 'RJ_SHIFT3' })
  rjShift3!: number;
}
