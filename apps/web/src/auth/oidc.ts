export const OIDC_PROVIDER_ID = "minecert-oidc";

export interface OidcConfiguration {
  issuer: string;
  clientId: string;
  clientSecret: string;
  providerName: string;
}

export interface VerifiedOidcIdentity {
  issuer: string;
  subject: string;
  email: string;
  name: string | null;
}

export function readOidcConfiguration(
  env: Readonly<Record<string, string | undefined>>,
): OidcConfiguration | null {
  const issuer = env.AUTH_OIDC_ISSUER?.trim();
  const clientId = env.AUTH_OIDC_CLIENT_ID?.trim();
  const clientSecret = env.AUTH_OIDC_CLIENT_SECRET?.trim();

  if (!issuer && !clientId && !clientSecret) {
    return null;
  }

  if (!issuer || !clientId || !clientSecret) {
    throw new Error(
      "Set AUTH_OIDC_ISSUER, AUTH_OIDC_CLIENT_ID, and AUTH_OIDC_CLIENT_SECRET together.",
    );
  }

  const secret = env.AUTH_SECRET;
  if (!secret || Buffer.byteLength(secret) < 32) {
    throw new Error("AUTH_SECRET must contain at least 32 bytes.");
  }

  let issuerUrl: URL;
  try {
    issuerUrl = new URL(issuer);
  } catch {
    throw new Error("AUTH_OIDC_ISSUER must be a valid HTTP or HTTPS URL.");
  }

  const isLocalIssuer =
    issuerUrl.hostname === "localhost" ||
    issuerUrl.hostname === "127.0.0.1" ||
    issuerUrl.hostname === "[::1]";
  if (
    (issuerUrl.protocol !== "https:" &&
      !(issuerUrl.protocol === "http:" && isLocalIssuer)) ||
    issuerUrl.username ||
    issuerUrl.password ||
    issuerUrl.search ||
    issuerUrl.hash
  ) {
    throw new Error(
      "AUTH_OIDC_ISSUER must use HTTPS, except for a local development issuer.",
    );
  }

  return {
    issuer: issuerUrl.toString().replace(/\/$/, ""),
    clientId,
    clientSecret,
    providerName: env.AUTH_OIDC_PROVIDER_NAME?.trim() || "Organisation sign-in",
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function toVerifiedOidcIdentity(
  profile: unknown,
  issuer: string,
  subject: string,
): VerifiedOidcIdentity | null {
  if (!isRecord(profile) || profile.email_verified !== true) {
    return null;
  }

  if (
    typeof profile.email !== "string" ||
    typeof issuer !== "string" ||
    typeof subject !== "string" ||
    !issuer.trim() ||
    !subject.trim()
  ) {
    return null;
  }

  const email = profile.email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return null;
  }

  const name =
    typeof profile.name === "string" && profile.name.trim()
      ? profile.name.trim()
      : null;

  return { issuer, subject, email, name };
}
