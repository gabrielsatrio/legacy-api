import { Field, Int, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ANG_RETUR_MAKAN_TAB')
@ObjectType()
export class ReturMakan extends BaseEntity {
  @Field(() => Int)
  @PrimaryColumn({ name: 'ID' })
  id!: number;

  @Field()
  @Column({ name: 'PLANT' })
  plant!: string;

  @Field()
  @Column({ name: 'TANGGAL' })
  tanggal!: Date;

  @Field()
  @Column({ name: 'CREATED_BY' })
  createdBy!: string;
}
