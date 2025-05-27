import { genkitNextHandler } from '@genkit-ai/next';
import '@/ai/dev'; // This will load your flows

export const POST = genkitNextHandler();
