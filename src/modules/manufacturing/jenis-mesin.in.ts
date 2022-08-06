import { MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { JenisMesinAt2 } from './entities/jenis-mesin';

@InputType()
export class JenisMesinAt2Input implements Partial<JenisMesinAt2> {
  @Field()
  @MaxLength(5)
  contract!: string;

  @Field()
  @MaxLength(25)
  mesin!: string;

  @Field({ nullable: true })
  @MaxLength(50)
  jenis?: string;
}
