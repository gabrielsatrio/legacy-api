import { Length } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { HeadAux } from './entities/ddp-head-aux';

@InputType()
export class HeadAuxInput implements Partial<HeadAux> {
  @Field()
  @Length(1, 5)
  contract!: string;

  @Field()
  @Length(1, 50)
  partNo!: string;

  @Field()
  alternate!: number;

  @Field()
  @Length(1, 50)
  componentPart!: string;

  @Field()
  @Length(1, 50)
  deskripsi!: string;

  @Field()
  resep!: number;

  @Field({ nullable: true })
  no?: number;
}
