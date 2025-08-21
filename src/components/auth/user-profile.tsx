"use client";

import { useSession } from "@/lib/auth-client";
import { SignInButton } from "./sign-in-button";
import { SignOutButton } from "./sign-out-button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useTranslations } from "@/lib/i18n";

export function UserProfile() {
  const { data: session, isPending } = useSession();
  const { t } = useTranslations();

  if (isPending) {
    return <div>{t('auth.loading')}</div>;
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center gap-4 p-6">
        <SignInButton />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-muted-foreground">
        {t('auth.welcome')} {session.user?.name}
      </span>
      <Avatar className="size-8">
        <AvatarImage
          src={session.user?.image || ""}
          alt={session.user?.name || "User"}
          referrerPolicy="no-referrer"
        />
        <AvatarFallback>
          {(
            session.user?.name?.[0] ||
            session.user?.email?.[0] ||
            "U"
          ).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <SignOutButton />
    </div>
  );
}
