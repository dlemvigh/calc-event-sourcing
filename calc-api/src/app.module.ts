import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { CalcJobResultModule } from './modules/calc-job-result/calc-job-result.module';
import { CalcJobStatusModule } from './modules/calc-job-status/calc-job-status.module';
import { CalcJobModule } from './modules/calc-job/calc-job.module';

@Module({
  imports: [
    CalcJobModule,
    CalcJobStatusModule,
    CalcJobResultModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      installSubscriptionHandlers: true,
    }),
  ],
})
export class AppModule {}
