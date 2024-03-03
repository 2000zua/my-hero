import { ObjectType, Field } from "@nestjs/graphql";


@ObjectType()
export abstract class OkResponse {
    @Field()
    ok: boolean;
}