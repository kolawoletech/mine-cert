import { prisma } from "@/lib/prisma";
import type { VerifiedOidcIdentity } from "./oidc";

export async function persistOidcIdentity(
  identity: VerifiedOidcIdentity,
): Promise<{ id: string; email: string; name: string | null }> {
  const emailVerifiedAt = new Date();

  return prisma.$transaction(async (transaction) => {
    const externalIdentity = await transaction.externalIdentity.findUnique({
      where: {
        issuer_subject: {
          issuer: identity.issuer,
          subject: identity.subject,
        },
      },
    });

    if (externalIdentity) {
      return transaction.user.update({
        where: { id: externalIdentity.userId },
        data: {
          email: identity.email,
          name: identity.name ?? undefined,
          emailVerifiedAt,
        },
        select: { id: true, email: true, name: true },
      });
    }

    const user = await transaction.user.upsert({
      where: { email: identity.email },
      create: {
        email: identity.email,
        name: identity.name,
        emailVerifiedAt,
      },
      update: {
        name: identity.name ?? undefined,
        emailVerifiedAt,
      },
      select: { id: true, email: true, name: true },
    });

    await transaction.externalIdentity.create({
      data: {
        issuer: identity.issuer,
        subject: identity.subject,
        userId: user.id,
      },
    });

    return user;
  });
}
