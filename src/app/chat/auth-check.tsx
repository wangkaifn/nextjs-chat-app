// components/AuthCheck.tsx
"use client";

import { useAuth } from "@/contexts/AuthProvider";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getConversationList } from "@/services/conversationService";

export default function AuthCheck({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      getConversationList(user.id).then((res) => {
        if (res.success) {
          if (res.data.length > 0) {
            router.push(`/chat/${res.data[0].id}`);
          } else {
            router.push("/chat");
          }
        }
      });
    }
  }, [user]);

  return <>{children}</>;
}
