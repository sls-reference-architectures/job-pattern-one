import { KeyValueRepository } from '@setho/dynamodb-repository';
import getDynamoDbClient from '../../common/dynamoDbClient';

export default class JobDbTestHelpers {
  constructor() {
    this.createdJobIds = [];
    this.repo = new KeyValueRepository({
      tableName: process.env.TABLE_NAME,
      keyName: 'id',
      idOptions: {
        prefix: 'JOB_',
      },
      documentClient: getDynamoDbClient(),
    });
  }

  async getJob(jobId) {
    const job = await this.repo.get(jobId);

    return job;
  }

  async teardown() {
    const deletePromises = this.createdJobIds.map((id) => this.repo.remove(id));
    await Promise.all(deletePromises);
  }

  trackForTeardown(jobId) {
    if (jobId) {
      this.createdJobIds.push(jobId);
    }
  }
}
