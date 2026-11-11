import { describe, expect, it } from "vitest";
import {
  readOidcConfiguration,
  toVerifiedOidcIdentity,
} from "./oidc";

const validEnvironment = {
  AUTH_OIDC_ISSUER: "https://identity.example.org/realms/minecert",
  AUTH_OIDC_CLIENT_ID: "minecert-web",
  AUTH_OIDC_CLIENT_SECRET: "provider-client-secret",
  AUTH_SECRET: "local-only-auth-secret-that-is-at-least-32-bytes",
};

describe("readOidcConfiguration", () => {
  it("allows the dashboard preview without an OIDC provider configured", () => {
    expect(readOidcConfiguration({})).toBeNull();
  });

  it("rejects partially configured OIDC settings", () => {
    expect(() =>
      readOidcConfiguration({
        AUTH_OIDC_ISSUER: validEnvironment.AUTH_OIDC_ISSUER,
      }),
    ).toThrow("Set AUTH_OIDC_ISSUER");
  });

  it("requires a sufficiently strong Auth.js secret", () => {
    expect(() =>
      readOidcConfiguration({
        ...validEnvironment,
        AUTH_SECRET: "short",
      }),
    ).toThrow("AUTH_SECRET must contain at least 32 bytes");
  });

  it("accepts HTTPS providers and normalizes their issuer", () => {
    expect(readOidcConfiguration(validEnvironment)).toEqual({
      issuer: "https://identity.example.org/realms/minecert",
      clientId: "minecert-web",
      clientSecret: "provider-client-secret",
      providerName: "Organisation sign-in",
    });
  });

  it("permits HTTP only for local development issuers", () => {
    expect(() =>
      readOidcConfiguration({
        ...validEnvironment,
        AUTH_OIDC_ISSUER: "http://identity.example.org",
      }),
    ).toThrow("AUTH_OIDC_ISSUER must use HTTPS");
  });
});

describe("toVerifiedOidcIdentity", () => {
  it("normalizes a verified OIDC identity", () => {
    expect(
      toVerifiedOidcIdentity(
        {
          email: "  Alex.Dlamini@Example.org ",
          email_verified: true,
          name: " Alex Dlamini ",
        },
        validEnvironment.AUTH_OIDC_ISSUER,
        "subject-123",
      ),
    ).toEqual({
      issuer: validEnvironment.AUTH_OIDC_ISSUER,
      subject: "subject-123",
      email: "alex.dlamini@example.org",
      name: "Alex Dlamini",
    });
  });

  it("rejects identities without an explicitly verified email claim", () => {
    expect(
      toVerifiedOidcIdentity(
        { email: "alex@example.org", email_verified: false },
        validEnvironment.AUTH_OIDC_ISSUER,
        "subject-123",
      ),
    ).toBeNull();
  });
});
