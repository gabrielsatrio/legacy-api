import { Length, MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { HeadResep } from './entities/ddp-head-resep';

@InputType()
export class HeadResepInput implements Partial<HeadResep> {
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

  @Field({ nullable: true })
  @MaxLength(300)
  notes?: string;

  @Field({ nullable: true })
  status?: string;

  @Field({ nullable: true })
  subResep?: string;
}
