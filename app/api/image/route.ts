import { auth } from '@clerk/nextjs';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI  from 'openai';
//import { ChatCompletionMessageParam } from 'openai/resources/index.mjs';
import MonsterApiClient from "monsterapi";
import axios from 'axios';
import { MonsterImageResponse } from '@/app/(dashboard)/(routes)/image/constants';
const configuration = { apiKey: process.env.MONSTER_API_KEY || '' }
//const openai = new OpenAI(configuration);
const client = new MonsterApiClient(process.env.MONSTER_API_KEY || '');

export async function POST( req: Request ) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { prompt, aspectRatio, samples, style } = body;

        if(!userId){
            return new NextResponse("Unauthorized", { status: 401 })
        }

        if(!client){
            return new NextResponse("OpenAI API KEY is not configured", { status: 500 });
        }

        if(!prompt){
            return new NextResponse("Prompt is required", { status: 400 });
        }

        if(!aspectRatio){
            return new NextResponse("Resolution is required", { status: 400 });
        }

        if(!samples){
            return new NextResponse("Amount is required", { status: 400 });
        }


        const url = 'https://api.monsterapi.ai/v1/generate/txt2img';
        const headers = {
          'accept': 'application/json',
          'authorization': 'Bearer ' + configuration.apiKey,
          'content-type': 'multipart/form-data',
        };

        const data = {
          prompt: prompt,
          aspect_ratio: aspectRatio,
          samples: samples,
          guidance_scale: 12.5,
          style: style         
        }

        const response = await axios.post(url, data, { headers });
        //const examplePrompt = "detailed sketch of lion by greg rutkowski, beautiful, intricate, ultra realistic, elegant, art by artgerm";
        return NextResponse.json(response.data);
    } catch (error) {
        console.log("IMAGE ERROR: ", error);
    }
}