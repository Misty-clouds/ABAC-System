import { NextResponse } from 'next/server';
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request, { params }: { params: { id: number } }) {
  const supabase =await createClient();
  const { id } = await params;  


  const { data: requests, error } = await supabase
    .from('requests')
    .select('*')
    .eq('user_id', id)

  if (error || !requests) {
    return NextResponse.json({ error: 'request not availabe' }, { status: 404 });
  }

  return NextResponse.json(requests);
}