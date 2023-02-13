import { IsNumber, MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { Sdl } from './entities/sdl';

@InputType()
export class SdlInput implements Partial<Sdl> {
  @Field()
  @IsNumber()
  sdlId!: number;

  @Field()
  @MaxLength(100)
  name!: string;

  @Field()
  @MaxLength(100)
  category!: string;

  @Field()
  @MaxLength(100)
  platform!: string;

  @Field()
  @MaxLength(10)
  status!: string;

  @Field()
  @MaxLength(2000)
  description!: string;

  @Field()
  @MaxLength(100)
  fileName!: string;

  @Field()
  @MaxLength(5)
  tier!: string;
}
