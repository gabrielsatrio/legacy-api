import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@ObjectType()
@Entity('VKY_TAMU_PRIBADI_V')
export class MessMemberVisitorView extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'ID' })
  id!: number;
  @Field()
  @Column({ name: 'MESS' })
  mess!: string;
  @Field()
  @Column({ name: 'ID_FORM' })
  id_form!: number;
  @Field()
  @Column({ name: 'NAMA' })
  nama!: string;
  @Field()
  @Column({ name: 'LAMA_MENGINAP' })
  lama_menginap!: number;
  @Field()
  @Column({ name: 'TOTAL' })
  total!: number;
  @Field()
  @Column({ name: 'INSERT_BY' })
  insert_by!: string;
}
