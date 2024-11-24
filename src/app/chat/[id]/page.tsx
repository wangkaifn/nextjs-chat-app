import ChatGPT from "../chat-gpt";

export default function Page({
  params,
}: {
  params: {
    id: string;
  };
}) {
  return <ChatGPT conversationId={params?.id} />;
}
