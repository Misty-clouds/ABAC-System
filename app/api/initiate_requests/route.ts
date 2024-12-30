import { NextResponse } from 'next/server';
import { createClient } from "@/utils/supabase/server";

interface RequestBody {
  user_id: string;
  resource: string;
  action: string;
  status: string;
}

export const POST = async (req: Request) => {
  const supabase = await createClient();

  const { user_id, resource, action, status }: RequestBody = await req.json();

  if (!user_id || !resource || !action || !status) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    // Step 1: Insert the request into the `requestsnew` table
    const { data: requestData, error: insertError } = await supabase
      .from('requests')
      .insert([{ user_id, resource, action, status }]);

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    // Step 2: Fetch the user's current trust score and clearance level
    const { data: userData, error: fetchError } = await supabase
      .from('users')
      .select('trust_score, clearance_level')
      .eq('id', user_id)
      .single();

    if (fetchError || !userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { trust_score: currentTrustScore, clearance_level: currentClearanceLevel } = userData;

    // Step 3: Calculate the new trust score
    let trustScoreChange = 0;
    if (status === 'Approved') {
      trustScoreChange = 5;
    } else if (status === 'Denied') {
      trustScoreChange = -10;
    }
    console.log(trustScoreChange)

    const updatedTrustScore = currentTrustScore + trustScoreChange;
    console.log(updatedTrustScore)

    // Step 4: Update the user's trust score
    if (isNaN(updatedTrustScore)) {
      return NextResponse.json({ error: 'Invalid trust score' }, { status: 400 });
    }

    const { error: trustUpdateError } = await supabase
      .from('users')
      .update({ trust_score: updatedTrustScore })
      .eq('id', user_id);

    if (trustUpdateError) {
      return NextResponse.json({ error: trustUpdateError.message }, { status: 500 });
    }

    // Step 5: Calculate and update the clearance level
    let newClearanceLevel = currentClearanceLevel;

    if (updatedTrustScore >= 125 && newClearanceLevel < 5) {
      newClearanceLevel += 1;
    } else if (updatedTrustScore < -50 && newClearanceLevel > 0) {
      newClearanceLevel -= 1;
    }

    if (newClearanceLevel !== currentClearanceLevel) {
      const { error: clearanceUpdateError } = await supabase
        .from('users')
        .update({ clearance_level: newClearanceLevel })
        .eq('id', user_id);

      if (clearanceUpdateError) {
        return NextResponse.json({ error: clearanceUpdateError.message }, { status: 500 });
      }
    }

    // Step 6: Return success response
    return NextResponse.json({
      message: 'Request processed successfully',
      requestData,
      updatedTrustScore,
      newClearanceLevel,
    }, { status: 200 });
  } catch (err: unknown) {
    console.error(err);
    const errorMessage = (err as Error)?.message || 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
};
