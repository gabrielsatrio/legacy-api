import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@ObjectType()
@Entity('VKY_TAMU_PERUSAHAAN_V')
export class MessCompanyVisitorView extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'ID' })
  id!: number;

  @Field()
  @Column({ name: 'MESS' })
  mess!: string;

  @Field()
  @Column({ name: 'ID_FORM' })
  idForm!: number;

  @Field({ nullable: true })
  @Column({ name: 'NAMA' })
  nama?: string;

  @Field()
  @Column({ name: 'LAMA_MENGINAP' })
  lamaMenginap!: number;

  @Field()
  @Column({ name: 'TOTAL' })
  total!: number;

  @Field()
  @Column({ name: 'INSERT_BY' })
  insertBy!: string;
}
