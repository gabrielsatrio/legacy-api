import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('VKY_MESS_FORM_V')
@ObjectType()
export class MessFormView extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'ID' })
  id!: number;

  @Field()
  @Column({ name: 'MESS' })
  mess!: string;

  @Field()
  @Column({ name: 'TANGGAL_TAGIHAN' })
  tanggalTagihan!: Date;

  @Field()
  @Column({ name: 'KETUA' })
  ketua!: string;

  @Field()
  @Column({ name: 'TOTAL_LISTRIK' })
  totalListrik!: number;

  @Field()
  @Column({ name: 'TOTAL_AIR' })
  totalAir!: number;

  @Field()
  @Column({ name: 'IURAN_RT' })
  iuranRt!: number;

  @Field()
  @Column({ name: 'IURAN_SAMPAH' })
  iuranSampah!: number;

  @Field()
  @Column({ name: 'INTERNET' })
  internet!: number;

  @Field()
  @Column({ name: 'CREATED_BY' })
  createdBy!: string;

  @Field()
  @Column({ name: 'TANGGAL_DIBUAT' })
  tanggalDibuat!: Date;
}
