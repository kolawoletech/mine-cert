"use server";

import { signIn } from "@/auth";
import { OIDC_PROVIDER_ID } from "@/auth/oidc";

export async function signInWithOidc(): Promise<void> {
  await signIn(OIDC_PROVIDER_ID, { redirectTo: "/" });
}
