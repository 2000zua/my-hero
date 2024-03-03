import { CreateHeroInput } from './create-hero.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateHeroInput extends PartialType(CreateHeroInput) {
  @Field(() => Int)
  id: number;
}
