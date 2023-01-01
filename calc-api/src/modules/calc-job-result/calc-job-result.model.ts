import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Calculation result' })
export class CalcJobResultModel {
  @Field(() => ID)
  id: string;

  @Field()
  input: number;

  @Field()
  output: number;
}
