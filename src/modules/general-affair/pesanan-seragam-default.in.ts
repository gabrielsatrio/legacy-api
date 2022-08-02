import { IsBoolean, IsNumber, IsString, MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { DefaultSeragam } from './entities/pesanan-seragam-default';

@InputType()
export class DefaultSeragamInput implements Partial<DefaultSeragam> {
  @Field()
  @IsNumber()
  id!: number;

  @Field()
  @IsString()
  jenis!: string;

  @Field()
  @MaxLength(4)
  tahun!: string;

  @Field()
  @IsNumber()
  periode!: number;

  @Field()
  @IsNumber()
  jumlahKemeja!: number;

  @Field()
  @IsNumber()
  jumlahCelana!: number;

  @Field()
  @IsBoolean()
  isLocked!: boolean;

  @Field()
  createdBy!: string;
}
