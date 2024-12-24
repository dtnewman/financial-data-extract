import { OpenAPI } from './generated';

// Initialize OpenAPI configuration
if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error('NEXT_PUBLIC_API_URL environment variable is not set');
}

OpenAPI.BASE = process.env.NEXT_PUBLIC_API_URL;
