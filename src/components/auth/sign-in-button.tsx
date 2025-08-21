"use client";

import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/lib/i18n";
import { SignInModal } from "./sign-in-modal";

export function SignInButton() {
  const { data: session, isPending } = useSession();
  const { t } = useTranslations();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isPending) {
    return <Button disabled>{t('auth.loading')}</Button>;
  }

  if (session) {
    return null;
  }

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)}>
        {t('auth.signIn')}
      </Button>
      
      <SignInModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}