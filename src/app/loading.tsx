import { Navbar } from "@/components/Navbar";

export default function LoadingPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 flex items-center justify-center">
        <p className="text-foreground font-base">Loading...</p>
      </main>
    </>
  );
}
