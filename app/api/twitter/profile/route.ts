import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

import { Scraper } from 'agent-twitter-client';

import { authOptions } from '@/lib/auth-options';

export async function POST(request: NextRequest) {
    try {
        // Check if the user has a valid session
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        // Parse the JSON body of the request
        const body = await request.json();
        const { username } = body;

        if (!username) {
            return NextResponse.json({ error: 'Username is required' }, { status: 400 });
        }

        const scraper = new Scraper();
        const profile = await scraper.getProfile(username);

        return NextResponse.json(profile);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
    }
}
