import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field()
  firstname?: string;
  
  @Field()
  email: string;
  
}
