import { ArgsType } from "@nestjs/graphql";


@ArgsType()
export class PaginationArgs {
    skit?: number;
    after?: string;
    before?: string;
    first?: number;
    last?: number;
}