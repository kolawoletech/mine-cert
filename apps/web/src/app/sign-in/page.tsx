import Link from "next/link";
import { ArrowLeft, ArrowUpRight, ShieldCheck } from "lucide-react";
import { readOidcConfiguration } from "@/auth/oidc";
import { signInWithOidc } from "./actions";

export const metadata = {
  title: "Sign in | MineCert",
};

export const dynamic = "force-dynamic";

export default function SignInPage() {
  const oidcConfiguration = readOidcConfiguration(process.env);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f8f5] px-5 py-12">
      <section className="w-full max-w-[410px] rounded-xl border border-[#e7ebe4] bg-white p-7 shadow-[0_12px_42px_rgba(27,45,33,0.07)] sm:p-9">
        <Link
          href="/"
          className="mb-9 inline-flex items-center gap-2 text-xs font-medium text-[#68766b] transition hover:text-[#254333]"
        >
          <ArrowLeft size={15} />
          Back to preview
        </Link>

        <div className="mb-6 grid size-11 place-items-center rounded-lg bg-[#edf4e5] text-[#527342]">
          <ShieldCheck size={23} strokeWidth={1.7} />
        </div>

        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#829078]">
          MineCert workspace
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#1d2b24]">
          Sign in to continue
        </h1>
        <p className="mt-2 text-sm leading-6 text-[#78827c]">
          Use your organisation&apos;s secure sign-in provider to access MineCert.
        </p>

        {oidcConfiguration ? (
          <form action={signInWithOidc} className="mt-7">
            <button
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-[#254333] px-4 text-sm font-medium text-white transition hover:bg-[#305640] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#71915d]"
              type="submit"
            >
              Continue with {oidcConfiguration.providerName}
              <ArrowUpRight size={15} />
            </button>
          </form>
        ) : (
          <div
            className="mt-7 rounded-lg border border-[#e8ebdf] bg-[#f7f8f2] p-4"
            role="status"
          >
            <p className="text-sm font-semibold text-[#46563d]">
              Sign-in provider not configured
            </p>
            <p className="mt-1.5 text-xs leading-5 text-[#78836d]">
              Set the OIDC issuer, client ID, client secret, and a 32-byte
              AUTH_SECRET in the root environment file to enable sign-in.
            </p>
          </div>
        )}

        <p className="mt-6 border-t border-[#edf0eb] pt-5 text-[11px] leading-5 text-[#99a199]">
          Only identities with a verified email are linked. Organisation
          membership and access permissions are checked separately by the API.
        </p>
      </section>
    </main>
  );
}
