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

  @Field()
  contract!: string;

  @Field({ nullable: true })
  associationNo?: string;

  @Field()
  customerNo!: string;

  @Field({ nullable: true })
  customerName?: string;

  @Field()
  @IsDate()
  dateDelivered!: Date;

  @Field()
  noSj!: string;
}
