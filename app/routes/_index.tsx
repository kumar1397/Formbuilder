// app/routes/index.tsx
import type { MetaFunction } from "@remix-run/node";
import { useIsHydrated } from "~/hooks/useIsHydrated";
import ClientFormBuilder from "~/components/ClientFormBuilder";

export const meta: MetaFunction = () => {
  return [
    { title: "Form Builder" },
    { name: "description", content: "Create and preview dynamic forms" },
  ];
};

export default function Index() {
  const hydrated = useIsHydrated();

  return (
    <main className="bg-gray-100 min-h-screen p-4">
      {hydrated ? <ClientFormBuilder /> : <p className="text-center py-10">Loading...</p>}
    </main>
  );
}
