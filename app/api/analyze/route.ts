import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request: Request) {
    try {
        const { signedUrl } = await request.json();

        if (!signedUrl) {
            return NextResponse.json(
                { error: 'No signed URL provided' },
                { status: 400 }
            );
        }

        console.log("Sending request to OpenAI")
        console.log(signedUrl)

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: "Please analyze this bank statement and extract all transaction details from any tables present. Format the data as a JSON array of transactions with date, description, and amount fields."
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: signedUrl
                            }
                        }
                    ]
                }
            ],
            max_tokens: 4096
        });

        console.log(response)

        return NextResponse.json({
            analysis: response.choices[0].message.content
        });
    } catch (error) {
        console.error('Error analyzing document:', error);
        return NextResponse.json(
            { error: 'Failed to analyze document' },
            { status: 500 }
        );
    }
} 