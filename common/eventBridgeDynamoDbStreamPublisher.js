import { PutEventsCommand } from '@aws-sdk/client-eventbridge';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import Logger from '@dazn/lambda-powertools-logger';

export default class EventBridgeDynamoDbStreamPublisher {
  constructor({ eventBusName, eventBridgeClient }) {
    this.eventBusName = eventBusName;
    this.eventBridgeClient = eventBridgeClient;
  }

  async publish(dynamoDbStreamEvent) {
    try {
      const newEntries = this.#convertNewEntries(dynamoDbStreamEvent);
      const modifiedEntries = this.#convertModifiedEntries(dynamoDbStreamEvent);
      const deletedEntries = this.#convertDeletedEntries(dynamoDbStreamEvent);
      const allEntries = [...newEntries, ...modifiedEntries, ...deletedEntries];
      const putEventsCommand = new PutEventsCommand({ Entries: allEntries });
      await this.eventBridgeClient.send(putEventsCommand);
    } catch (err) {
      Logger.error('Error publishing to EB', { dynamoDbStreamEvent }, err);
      throw err;
    }
  }

  #convertDeletedEntries(dynamoDbStreamEvent) {
    const ebEvents = dynamoDbStreamEvent.Records.filter(
      (record) => record.eventName === 'REMOVE',
    ).map((record) => {
      const deletedImage = unmarshall(record.dynamodb.OldImage);

      return {
        Detail: JSON.stringify(deletedImage),
        Source: 'job',
        DetailType: 'delete',
        EventBusName: this.eventBusName,
      };
    });

    return ebEvents;
  }

  #convertNewEntries(dynamoDbStreamEvent) {
    const ebEvents = dynamoDbStreamEvent.Records.filter(
      (record) => record.eventName === 'INSERT',
    ).map((record) => {
      const newImage = unmarshall(record.dynamodb.NewImage);

      return {
        Detail: JSON.stringify(newImage),
        Source: 'job',
        DetailType: 'create',
        EventBusName: this.eventBusName,
      };
    });

    return ebEvents;
  }

  #convertModifiedEntries(dynamoDbStreamEvent) {
    const ebEvents = dynamoDbStreamEvent.Records.filter(
      (record) => record.eventName === 'MODIFY',
    ).map((record) => {
      const newImage = unmarshall(record.dynamodb.NewImage);
      const oldImage = unmarshall(record.dynamodb.OldImage);

      return {
        Detail: JSON.stringify({ old: oldImage, new: newImage }),
        Source: 'job',
        DetailType: 'update',
        EventBusName: this.eventBusName,
      };
    });

    return ebEvents;
  }
}
