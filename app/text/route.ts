import { NextRequest } from 'next/server';
import { handleTextTap } from './handler';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export function GET(request: NextRequest) { return handleTextTap(request, 'direct'); }
