import { auth } from '@clerk/nextjs';
import { NextRequest, NextResponse } from 'next/server';
import MonsterApiClient from "monsterapi";
import axios from 'axios';
const configuration = { apiKey: process.env.MONSTER_API_KEY || '' }
const client = new MonsterApiClient(process.env.MONSTER_API_KEY || '');

export const getProcessStatus = async (processId: string) => {
  const url = `https://api.monsterapi.ai/v1/status/${processId}`;
  const token = configuration.apiKey; // Replace with your actual token

  const headers = {
    'authorization': `Bearer ${token}`,
    'accept': 'application/json',
  };

  try {
    const response = await axios.get(url, { headers });
    return response.data
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};


export async function GET( req: NextRequest ) {
  const geturl = new URL(req.url);
  const processId = geturl.searchParams.get('process_id') as string;

  const url = `https://api.monsterapi.ai/v1/status/${processId}`;
  const token = configuration.apiKey; // Replace with your actual token

  const headers = {
    'authorization': `Bearer ${token}`,
    'accept': 'application/json',
  };

  try {
    const response = await axios.get(url, { headers });
    return NextResponse.json({data: response.data})
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: error}) || null;
  }
}