import { Field, Int, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ANG_BON_MAKAN_KHL_LINE_V')
@ObjectType()
export class BonMakanKhlDetailView extends BaseEntity {
  @Field(() => Int)
  @PrimaryColumn({ name: 'ID' })
  id!: number;

  @Field()
  @Column({ name: 'NRP' })
  nrp!: string;

  @Field()
  @Column({ name: 'NAMA' })
  nama!: string;

  @Field(() => Int)
  @Column({ name: 'BON_MAKAN_KHL_ID' })
  bonMakanKhlId!: number;
}
