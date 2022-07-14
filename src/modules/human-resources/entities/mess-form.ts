import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('VKY_MESS_FORM')
@ObjectType()
export class MessForm extends BaseEntity {
  @Field({ nullable: true })
  @PrimaryColumn({ name: 'ID' })
  id?: number;
  @Field()
  @Column({ name: 'MESS' })
  mess!: string;
  @Field()
  @Column({ name: 'TANGGAL_TAGIHAN' })
  tanggal_tagihan!: Date;
  @Field()
  @Column({ name: 'KETUA' })
  ketua!: string;
  @Field()
  @Column({ name: 'TOTAL_LISTRIK' })
  total_listrik!: number;
  @Field()
  @Column({ name: 'TOTAL_AIR' })
  total_air!: number;
  @Field()
  @Column({ name: 'IURAN_RT' })
  iuran_rt!: number;
  @Field()
  @Column({ name: 'IURAN_SAMPAH' })
  iuran_sampah!: number;

  @Field()
  @Column({ name: 'INTERNET' })
  internet!: number;
  @Field()
  @Column({ name: 'CREATED_BY' })
  created_by!: string;
}
