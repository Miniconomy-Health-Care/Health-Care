import {SendMessageCommand, SQSClient} from '@aws-sdk/client-sqs';

export async function sendQueueMessage(queueUrl: string, message: Record<string, any>) {
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
