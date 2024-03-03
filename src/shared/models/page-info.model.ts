import { ObjectType } from "@nestjs/graphql";


@ObjectType()
export class PageInfo{
    endCursor?: string;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string;
}