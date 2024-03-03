import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Hero {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
