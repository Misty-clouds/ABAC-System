import { NextResponse } from 'next/server';
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request, { params }: { params: { id: number } }) {
  const supabase =await createClient();
  const { id } = await params;  


  const { data: user, error } = await supabase
    .from('users')
    .select()
    .eq('id', id)
    .single();

  if (error || !user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json(user);
}
