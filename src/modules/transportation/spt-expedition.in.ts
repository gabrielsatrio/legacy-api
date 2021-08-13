import { Field, InputType } from 'type-graphql';
import { Expedition } from './entities/spt-expedition';

@InputType()
export class ExpeditionInput implements Partial<Expedition> {
  @Field()
  expeditionId!: string;

  @Field()
  expeditionName!: string;
}
