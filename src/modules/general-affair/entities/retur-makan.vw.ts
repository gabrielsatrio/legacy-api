import { Field, Int, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ANG_RETUR_MAKAN_V')
@ObjectType()
export class ReturMakanView extends BaseEntity {
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
