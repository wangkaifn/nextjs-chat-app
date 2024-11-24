import { useUser } from '@/contexts/UserContext';
import { getCurrentUser } from '@/services/userService';
import { redirect } from 'next/navigation';
import ChatGPT from './chat-gpt';
export default async function Page() {
  // if (!result) {
  //   redirect('/login');
  // }

  return <div className="flex-1"></div>;
}
