import { Length, MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { MasterResep } from './entities/ddp-master-resep';

@InputType()
export class MasterResepInput implements Partial<MasterResep> {
  @Field()
  @Length(1, 5)
  contract!: string;

  @Field()
  @Length(1, 50)
  partNo!: string;

  @Field()
  alternate!: number;

  @Field({ nullable: true })
  @MaxLength(50)
  programNo?: string;

  @Field()
  tanggalCelup!: Date;

  @Field()
  @Length(1, 50)
  jenis!: string;

  @Field()
  @Length(1, 50)
  componentPart!: string;

  @Field()
  @Length(1, 50)
  deskripsi!: string;

  @Field()
  resep!: number;

  @Field()
  @MaxLength(300)
  notes?: string;

  @Field()
  status!: string;
}
