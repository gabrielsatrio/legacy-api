import { MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { Menu } from './entities/menu';

@InputType()
export class MenuInput implements Partial<Menu> {
  @Field({ nullable: true })
  id?: number;

  @Field({ nullable: true })
  parent?: number;

  @Field()
  @MaxLength(100)
  name!: string;

  @Field()
  @MaxLength(100)
  to!: string;

  @Field({ nullable: true })
  @MaxLength(100)
  icon?: string;
}
