"use client";

import { signOut, useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useTranslations } from "@/lib/i18n";

export function SignOutButton() {
  const { data: session, isPending } = useSession();
  const { t } = useTranslations();
  const router = useRouter();

  if (isPending) {
    return <Button disabled>{t('auth.loading')}</Button>;
  }

  if (!session) {
    return null;
  }

  return (
    <Button
      variant="outline"
      onClick={async () => {
        await signOut();
        router.replace("/");
        router.refresh();
      }}
    >
      {t('auth.signOut')}
    </Button>
  );
}
