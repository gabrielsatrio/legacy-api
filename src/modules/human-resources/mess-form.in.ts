import { IsDate, IsNumber, MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { MessForm } from './entities/mess-form';

@InputType()
export class MessFormInput implements Partial<MessForm> {
  @Field()
  @IsNumber()
  id!: number;

  @Field()
  @MaxLength(20)
  mess!: string;

  @Field()
  @IsDate()
  tanggalTagihan!: Date;

  @Field()
  @MaxLength(5)
  ketua!: string;

  @Field()
  @IsNumber()
  totalListrik!: number;

  @Field()
  @IsNumber()
  totalAir!: number;

  @Field()
  @IsNumber()
  iuranRt!: number;

  @Field()
  @IsNumber()
  iuranSampah!: number;

  @Field()
  @IsNumber()
  biayaInternet!: number;

  @Field()
  @MaxLength(5)
  createdBy!: string;

  @Field()
  @IsDate()
  tanggalDibuat!: Date;
}
