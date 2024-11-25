import { EmptyState } from "./empty-state";
import AuthCheck from "./auth-check";

export default async function Page() {
  return (
    <AuthCheck>
      <div className="flex-1">
        <EmptyState />
      </div>
    </AuthCheck>
  );
}
