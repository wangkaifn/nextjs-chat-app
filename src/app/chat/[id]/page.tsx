import { memo } from "react";
import ChatGPT from "../chat-gpt";
import { useAuth } from "@/contexts/AuthProvider";

const MemoChatGPT = memo(ChatGPT);

export default async function Page(props: {
  params: Promise<{
    id: string;
  }>;
}) {
  const params = await props.params;

  return <MemoChatGPT conversationId={params?.id} />;
}
