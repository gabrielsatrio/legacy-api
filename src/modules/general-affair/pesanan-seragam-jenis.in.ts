import { IsNumber, IsString, MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { JenisSeragam } from './entities/pesanan-seragam-jenis';

@InputType()
export class JenisSeragamInput implements Partial<JenisSeragam> {
  @Field()
  @IsNumber()
  id!: number;

  @Field()
  @MaxLength(50)
  jenis!: string;

  @Field()
  @IsString()
  createdBy!: string;
}
