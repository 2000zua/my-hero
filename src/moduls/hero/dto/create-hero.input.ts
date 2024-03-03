import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateHeroInput {
  @Field()
  @IsNotEmpty()
  realName: string;

  @Field()
  @IsNotEmpty()
  alterEgo: string;
}
