import OpenAI from 'openai';
import { NextResponse } from 'next/server';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import { updateStatus, clearStatus } from '@/lib/status-store';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Add transaction schema
const transactionSchema = z.object({
  transactions: z.array(
    z.object({
      date: z.string(),
      description: z.string(),
      summary: z.string(),
      credit_amount: z.number().nullable(),
      debit_amount: z.number().nullable(),
      balance: z.number().nullable(),
      category: z.enum([
        'income',
        'housing',
        'transportation',
        'food',
        'utilities',
        'insurance',
        'healthcare',
        'savings',
        'personal',
        'entertainment',
        'other',
        'loan_payment',
        'employee_payroll',
        'inventory',
        'advertising',
        'other_business_expense',
        'unknown'
      ])
    })
  ),
  start_balance: z.number().nullable(),
  end_balance: z.number().nullable()
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { pdfUrl, jobId } = body;

    // Update status at different stages
    updateStatus(jobId, 'Fetching PDF...', 20);
    const pdfResponse = await fetch(pdfUrl);
    const pdfBlob = await pdfResponse.blob();

    updateStatus(jobId, 'Converting PDF to images...', 40);
    // Prepare form data for PDFRest
    const formData = new FormData();
    formData.append('file', pdfBlob, 'document.pdf');

    // Convert PDF to PNG using PDFRest
    const pdfRestResponse = await fetch('https://api.pdfrest.com/png', {
      method: 'POST',
      headers: {
        'Api-Key': process.env.PDFREST_API_KEY as string
      },
      body: formData
    });

    const pdfRestData = await pdfRestResponse.json();
    const imageUrls: string[] = pdfRestData.outputUrl;

    console.log('image urls', imageUrls);

    console.log('sending request to openai');

    updateStatus(jobId, 'Analyzing document with AI...', 60);
    // Use the converted image URL for OpenAI analysis
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user' as const,
          content: [
            {
              type: 'text',
              text: `Analyze this bank statement and extract all transactions from any tables present. 
              For each transaction, provide:
              - date
              - description (a short description of the transaction, pulled directly from the document)
              - summary (you should summarize the transaction with a short description of what it is, for example:
                "Payment for internet bill" or "Purchase at Walmart" or "Transfer from checking to savings")
              - credit and debit amounts (as numbers, using null when there is no amount)
              - category (classify each transaction into categories like income, housing, transportation, food, utilities, insurance, healthcare, savings, personal, entertainment, other)
              - balance (if available in the table, otherwise null)
              
              Also extract the start and end balance from the document if available, otherwise null.`
            },
            ...imageUrls.map((url) => ({
              type: 'image_url' as const,
              image_url: {
                url
              }
            }))
          ]
        }
      ],
      max_tokens: 4096,
      response_format: zodResponseFormat(transactionSchema, 'transactions')
    });

    console.log('response from openai');

    console.log(response);

    console.log(
      'response.choices[0].message.content',
      response.choices[0].message.content
    );

    updateStatus(jobId, 'Processing complete!', 100);

    const result = {
      transactions: JSON.parse(
        response.choices[0].message.content ||
        '{"transactions":[], "start_balance": null, "end_balance": null}'
      ).transactions,
      start_balance: JSON.parse(
        response.choices[0].message.content ||
        '{"transactions":[], "start_balance": null, "end_balance": null}'
      ).start_balance,
      end_balance: JSON.parse(
        response.choices[0].message.content ||
        '{"transactions":[], "start_balance": null, "end_balance": null}'
      ).end_balance
    };

    clearStatus(jobId); // Clean up status
    return NextResponse.json(result);
  } catch (error: unknown) {
    const jobId = (error as any)?.jobId;
    if (jobId) {
      clearStatus(jobId);
    }
    console.error('Error analyzing document:', error);
    return NextResponse.json(
      { error: 'Failed to analyze document' },
      { status: 500 }
    );
  }
}
