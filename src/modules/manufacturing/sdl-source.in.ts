import { IsNumber, MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { SdlSource } from './entities/sdl-source';

@InputType()
export class SdlSourceInput implements Partial<SdlSource> {
  @Field()
  @IsNumber()
  sdlId!: number;

  @Field()
  @IsNumber()
  lineNo!: number;

  @Field()
  @IsNumber()
  sourceId!: number;

  @Field()
  @MaxLength(1000)
  description!: string;
}
