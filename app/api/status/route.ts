// Store status updates in memory (consider using Redis or similar for production)
import { getStatus } from '@/lib/status-store';



export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    console.log('searchParams', searchParams);
    const jobId = searchParams.get('jobId');

    if (!jobId) {
        return new Response(
            JSON.stringify({ error: 'Job ID is required' }),
            { status: 400 }
        );
    }

    const statusUpdate = await getStatus(jobId);

    if (!statusUpdate) {
        return new Response(
            JSON.stringify({ error: 'Status not found' }),
            { status: 404 }
        );
    }

    return new Response(
        JSON.stringify(statusUpdate),
        {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );
}