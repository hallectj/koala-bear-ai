import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import OpenAI  from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs';

const configuration = { apiKey: process.env.OPENAI_API_KEY }

const openai = new OpenAI(configuration);
const instructions: ChatCompletionMessageParam = {
    name: 'User',
    role: 'system',
    content: "You are an AI named KoalaBear AI. You are a code generator. You must answer only in markdown code snippets. Use code blocks to format your answers. Use code comments for explanations.",
}

export async function POST( req: Request ) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { messages } = body;
        if(!userId){
            return new NextResponse("Unauthorized", { status: 401 })
        }

        if(!configuration.apiKey){
            return new NextResponse("OpenAI API KEY is not configured", { status: 500 });
        }

        if(!messages){
            return new NextResponse("Messages are required", { status: 400 });
        }

        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [instructions, ...messages],
        });

        return NextResponse.json(response.choices[0].message);
    } catch (error) {
        console.log("CODE ERROR: ", error);
    }
}