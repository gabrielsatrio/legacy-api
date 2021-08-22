import { Length } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { HeadDye } from './entities/ddp-head-dye';

@InputType()
export class HeadDyeInput implements Partial<HeadDye> {
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

  @Field()
  no!: number;
}
