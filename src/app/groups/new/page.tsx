import { Navbar } from "@/components/Navbar";
import { CreateGroupForm } from "@/components/CreateGroupForm";

export default function NewGroupPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Create a Savings Group
        </h1>
        <CreateGroupForm />
      </main>
    </>
  );
}
