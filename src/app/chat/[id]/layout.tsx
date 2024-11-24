import ChatGPT from "../chat-gpt";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="flex-1">{children}</div>;
}
