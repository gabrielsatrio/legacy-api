import { Length, MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { BPPF } from './entities/bppf';

@InputType()
export class BPPFInput implements Partial<BPPF> {
  @Field()
  @Length(1, 5)
  contract!: string;

  @Field({ nullable: true })
  tanggal?: Date;

  @Field()
  @MaxLength(150)
  dept!: string;

  @Field()
  @MaxLength(150)
  jenisBarang!: string;

  @Field()
  @MaxLength(150)
  kodeBarang!: string;

  @Field()
  @MaxLength(150)
  namaBarang!: string;

  @Field({ nullable: true })
  @MaxLength(150)
  noWarna?: string;

  @Field({ nullable: true })
  @MaxLength(150)
  lot?: string;

  @Field()
  quantity!: number;

  @Field()
  @MaxLength(5)
  satuan!: string;

  @Field({ nullable: true })
  @MaxLength(200)
  keterangan?: string;

  @Field({ nullable: true })
  idNo?: number;
}
