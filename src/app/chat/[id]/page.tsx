import ChatGPT from "../chat-gpt";

export default async function Page(
  props: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  const params = await props.params;
  return <ChatGPT conversationId={params?.id} />;
}
