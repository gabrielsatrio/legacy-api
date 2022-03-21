import { MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { KeteranganLostTime } from './entities/ket-lost-time';

@InputType()
export class KeteranganLostTimeInput implements Partial<KeteranganLostTime> {
  @Field({ nullable: true })
  @MaxLength(5)
  contract?: string;

  @Field()
  @MaxLength(100)
  lostTime!: string;

  @Field()
  @MaxLength(25)
  tipe!: string;
}
