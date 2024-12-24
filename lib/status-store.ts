import { PutCommand, GetCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { dynamodb } from './dynamodb';

const TABLE_NAME = 'casca-job-status';

export async function updateStatus(
    jobId: string,
    status: string,
    progress: number
) {
    await dynamodb.send(new PutCommand({
        TableName: TABLE_NAME,
        Item: {
            jobId,
            status,
            progress,
            ttl: Math.floor(Date.now() / 1000) + 3600 // expire after 1 hour
        }
    }));
}

export async function getStatus(jobId: string) {
    const result = await dynamodb.send(new GetCommand({
        TableName: TABLE_NAME,
        Key: { jobId }
    }));

    return result.Item;
}

export async function clearStatus(jobId: string) {
    await dynamodb.send(new DeleteCommand({
        TableName: TABLE_NAME,
        Key: { jobId }
    }));
}