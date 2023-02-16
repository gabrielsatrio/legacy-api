import { IsDate, IsNumber } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';
import { FakturPajak } from './entities/faktur-pajak';

@InputType()
export class FakturPajakInput implements Partial<FakturPajak> {
  @Field(() => Int)
  @IsNumber()
  id!: number;

  @Field({ nullable: true })
  kodeFaktur?: string;

  @Field({ nullable: true })
  contract?: string;

  @Field({ nullable: true })
  associationNo?: string;

  @Field({ nullable: true })
  customerNo?: string;

  @Field({ nullable: true })
  customerName?: string;

  @Field({ nullable: true })
  @IsDate()
  dateDelivered?: Date;

  @Field({ nullable: true })
  noSj?: string;
}
