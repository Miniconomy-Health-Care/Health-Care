import {PurgeQueueCommand, SendMessageCommand, SQSClient} from '@aws-sdk/client-sqs';

export async function sendQueueMessage(queueUrl: string, message: Record<string, any>) {
    console.log('Queue message');
    console.log(message);
    const sqsClient = new SQSClient();
    const command = new SendMessageCommand({
        QueueUrl: queueUrl,
        MessageBody: JSON.stringify(message),
        MessageGroupId: 'default'
    });

    const response = await sqsClient.send(command);
    console.log(response);
    return response;
}

export async function purgeQueues(queueUrls: string[]) {
    const sqsClient = new SQSClient();
    for (const queueUrl of queueUrls) {

        const command = new PurgeQueueCommand({QueueUrl: queueUrl});
        await sqsClient.send(command);
    }
}
