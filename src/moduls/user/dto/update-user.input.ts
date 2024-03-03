import { Language } from '@prisma/client';
import { InputType, Field} from '@nestjs/graphql';

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  firstname?: string;
  @Field({ nullable: true })
  language?: Language;
}
