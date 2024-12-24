import OpenAI from 'openai';
import { NextResponse } from 'next/server';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Define the response schema
const summaryResponseSchema = z.object({
    summary: z.string(),
    risk_factors: z.array(z.string()),
    risk_assessment: z.enum(['Risky', 'Neutral', 'Not Risky'])
});

type SummaryRequest = {
    categoryTotals: Record<string, { credits: number; debits: number }>;
    startBalance: number | null;
    endBalance: number | null;
    totalCredits: number;
    totalDebits: number;
};

export async function POST(request: Request) {
    try {
        const body: SummaryRequest = await request.json();

        const message = `Please analyze this financial data and provide:
          1. A brief summary of the financial activity
          2. A list of credit risk factors (return as an array)
          3. A risk assessment (must be exactly one of: "Risky", "Neutral", or "Not Risky")
          
          Financial Data:
          - Starting Balance: ${body.startBalance}
          - Ending Balance: ${body.endBalance}
          - Total Credits: ${body.totalCredits}
          - Total Debits: ${body.totalDebits}
          
          Category Breakdown:
          ${Object.entries(body.categoryTotals)
                .map(
                    ([category, { credits, debits }]) =>
                        `${category}: Credits: ${credits}, Debits: ${debits}`
                )
                .join('\n')}`;

        console.log('Sending request to OpenAI with message:', message);

        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'system',
                    content: `You are a financial analyst. Analyze the provided financial data and create a summary of the transactions and assess credit risk. Focus on spending patterns, income stability, and overall financial health.`
                },
                {
                    role: 'user',
                    content: message
                }
            ],
            temperature: 0.7,
            max_tokens: 500,
            response_format: zodResponseFormat(summaryResponseSchema, 'summary')
        });
        // Parse and validate response content
        const content = response.choices[0].message?.content;
        if (!content) {
            throw new Error('No content in response');
        }
        const parsedContent = JSON.parse(content);
        return NextResponse.json(parsedContent);
    } catch (error) {
        console.error('Error analyzing summary:', error);
        return NextResponse.json(
            { error: 'Failed to analyze summary' },
            { status: 500 }
        );
    }
} 