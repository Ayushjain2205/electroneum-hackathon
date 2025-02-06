import { Nav } from "@/components/navbar";

export default function ShopPage() {
  return (
    <main className="min-h-screen">
      <Nav />
      <div className="container py-8">
        <h1 className="text-4xl font-display mb-4">Zoey's Shop</h1>
        <p className="text-lg">Browse and purchase items here.</p>
      </div>
    </main>
  );
}
