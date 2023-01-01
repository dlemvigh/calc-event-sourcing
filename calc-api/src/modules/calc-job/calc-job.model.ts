import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CalcJobModel {
  @Field()
  id: string;

  @Field()
  input: number;

  @Field({ nullable: true })
  output?: number;
}
