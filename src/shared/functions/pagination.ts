import { Type } from "@nestjs/common";
import { Field, Int, ObjectType } from "@nestjs/graphql";
import { PageInfo } from "../models/page-info.model";


export default function Paginated<TItem>(TItemClass: Type<TItem>){

    @ObjectType(`${TItemClass.name} Edge`)
    abstract class EdgeType {
        @Field(() => String)
        cursor: string;

        @Field(() => TItemClass)
        node: TItem
    }

    // `isAbstract` decorator option is mandatory to prevent registering in schema
    @ObjectType({isAbstract: true})
    abstract class PaginatedType {
        @Field(() => [EdgeType], {nullable: true})
        edges: Array<EdgeType>

        @Field(() => PageInfo)
        pageInfor: PageInfo;

        @Field(() => Int)
        totalCount: number;
    }

    return PaginatedType;
    
}