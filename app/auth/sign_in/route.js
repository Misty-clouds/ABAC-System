'use server'
import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";


export const signInAction = async (formData) => {
  const email = formData.get("email");
  const password = formData.get("password");
  const supabase = await createClient();

  // Clearance levels and corresponding trust scores
  const clearanceLevels = [1, 2, 3, 4, 5];
  const trustScores = [20, 40, 60, 80, 100];

  // Roles for each clearance level
  const roles = {
    1: ["Intern", "Assistant", "Junior Clerk", "Support Staff", "Receptionist"],
    2: ["Supervisor", "Team Lead", "Coordinator", "Analyst", "Scheduler"],
    3: ["Manager", "Project Manager", "Senior Analyst", "Lead Coordinator", "Operations Head"],
    4: ["Director", "Regional Manager", "VP Operations", "Product Head", "General Manager"],
    5: ["CEO", "CTO", "CFO", "Chief Strategist", "President"],
  };

  // Departments for each clearance level
  const departments = {
    1: ["Customer Support", "Admin Support", "Logistics", "Human Resources", "Marketing"],
    2: ["Sales", "Operations", "Procurement", "Customer Relations", "Quality Assurance"],
    3: ["Finance", "IT Support", "Product Development", "Business Analysis", "Corporate Strategy"],
    4: ["Legal", "Compliance", "R&D", "HR Strategy", "Operations Management"],
    5: ["Executive", "Board", "Corporate Strategy", "Leadership", "Executive Management"],
  };

  // Generate random values
  const randomClearanceLevel =
    clearanceLevels[Math.floor(Math.random() * clearanceLevels.length)];
  const randomTrustScore =
    trustScores[Math.floor(Math.random() * trustScores.length)];
  const assignedRole =
    roles[randomClearanceLevel][Math.floor(Math.random() * roles[randomClearanceLevel].length)];
  const assignedDepartment =
    departments[randomClearanceLevel][Math.floor(Math.random() * departments[randomClearanceLevel].length)];

  // Perform sign-in operation
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return encodedRedirect("error", "/sign-in", "User not found after sign-in");
  }

  const id = user.id;

  // Check if a record with the given `id` already exists
  const { data: existingUser, error: fetchError } = await supabase
    .from("users")
    .select("id")
    .eq("id", id)
    .single();

  if (existingUser) {
    // Redirect if the user already exists
    return redirect("/protected");
  }


  if (fetchError) {

    // Insert new user data
    const { error: insertError } = await supabase
      .from("users")
      .insert({
        email: email,
        id: id,
        clearance_level: randomClearanceLevel,
        role: assignedRole,
        department: assignedDepartment,
        trust_score: randomTrustScore,
      });

    if (insertError) {
      console.error("Error inserting user:", insertError.message);
      return encodedRedirect("error", "/sign-in", insertError.message);
    }

    //Insert Sign in requests to the user
    const { error: requestsError } = await supabase
      .from("requests")
      .insert({
        action: 'Sign In',
        resource: 'Authentication',
        status: 'Approved',
        user_id: id

      });

    if (requestsError) {
      console.error("Error inserting requests:", requestsError.message);
      return encodedRedirect("error", "/sign-in", requestsError.message);
    }


    // Redirect to the protected page after successful insertion
    return redirect("/protected");
  }


};
