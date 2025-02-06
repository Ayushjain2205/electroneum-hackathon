import { Nav } from "@/components/navbar";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Nav />
      <div className="container py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Talk Section */}
          <div className="p-6 bg-white border-2 border-black rounded-lg shadow-brutal hover:shadow-brutal-lg transition-shadow">
            <h2 className="mb-2 text-2xl font-display">Talk</h2>
            <p className="text-base">Start a conversation with Zoey</p>
          </div>

          {/* Shop Section */}
          <div className="p-6 bg-white border-2 border-black rounded-lg shadow-brutal hover:shadow-brutal-lg transition-shadow">
            <h2 className="mb-2 text-2xl font-display">Shop</h2>
            <p className="text-base">Browse Zoey's store</p>
          </div>

          {/* Memory Section */}
          <div className="p-6 bg-white border-2 border-black rounded-lg shadow-brutal hover:shadow-brutal-lg transition-shadow">
            <h2 className="mb-2 text-2xl font-display">Memory</h2>
            <p className="text-base">View your shared memories</p>
          </div>
        </div>
      </div>
    </main>
  );
}
