import { registerEnumType } from "@nestjs/graphql";

export enum OrderDirectionEnum {
    // Specifies an ascending order for a given `orderBy` argument.
    asc = 'asc',
    // Specifies a descending order for a given `orderBy` argument.
    desc = 'desc',

}

registerEnumType(OrderDirectionEnum, {
    name: 'OrderDirection',
    description: 'Possíveis instruções para ordenar uma lista de itens quando fornecido um argumento orderBy',
});