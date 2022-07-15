import { Field, InputType } from 'type-graphql';
import { MessForm } from './entities/mess-form';

@InputType()
export class MessFormInput implements Partial<MessForm> {
  @Field({ nullable: true })
  id?: number;
  @Field()
  mess!: string;
  @Field()
  tanggal_tagihan!: Date;
  @Field()
  tanggal_dibuat!: Date;
  @Field()
  ketua!: string;
  @Field()
  total_listrik!: number;
  @Field()
  total_air!: number;
  @Field()
  iuran_rt!: number;
  @Field()
  iuran_sampah!: number;

  @Field()
  internet!: number;
  @Field()
  created_by!: string;
}
