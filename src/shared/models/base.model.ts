import { Field, ObjectType ,ID } from "@nestjs/graphql";

@ObjectType({isAbstract: true})
export abstract class BaseModel {
    
    @Field(() => ID)
    id: string;

    @Field({description: 'Indentificar quando foi criado o objecto'})
    createdAt: Date;

    @Field({description: 'Indentificar quando foi actualizado o objecto'})
    updateAt: Date;

}