import { IsNumber, MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { SdlLog } from './entities/sdl-log';

@InputType()
export class SdlLogInput implements Partial<SdlLog> {
  @Field()
  @IsNumber()
  sdlId!: number;

  @Field()
  @IsNumber()
  lineNo!: number;

  @Field()
  @MaxLength(1000)
  description!: string;
}
