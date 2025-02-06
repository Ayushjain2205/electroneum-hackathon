import { Nav } from "@/components/navbar";

export default function MemoryPage() {
  return (
    <main className="min-h-screen">
      <Nav />
      <div className="container py-8">
        <h1 className="text-4xl font-display mb-4">Memories with Zoey</h1>
        <p className="text-lg">View your shared memories here.</p>
      </div>
    </main>
  );
}
