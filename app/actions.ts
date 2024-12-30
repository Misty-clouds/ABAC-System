"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required",
    );
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  } else {
    return encodedRedirect(
      "success",
      "/sign-up",
      "Thanks for signing up! Please check your email for a verification link.",
    );
  }
};


export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};


export const signInAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString() || "";
  const password = formData.get("password")?.toString() || "";
  const supabase = await createClient();

  // Clearance levels and corresponding trust scores
  const clearanceLevels = [1, 2, 3, 4, 5];
  const trustScores = [20, 40, 60, 80, 100];

  // Roles for each clearance level
  const roles: { [key: number]: string[] } = {
    1: ["Intern", "Assistant", "Junior Clerk", "Support Staff", "Receptionist"],
    2: ["Supervisor", "Team Lead", "Coordinator", "Analyst", "Scheduler"],
    3: ["Manager", "Project Manager", "Senior Analyst", "Lead Coordinator", "Operations Head"],
    4: ["Director", "Regional Manager", "VP Operations", "Product Head", "General Manager"],
    5: ["CEO", "CTO", "CFO", "Chief Strategist", "President"],
  };

  // Departments for each clearance level
  const departments: { [key: number]: string[] } = {
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
