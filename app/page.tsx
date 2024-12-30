import Hero from "@/components/hero";
import Description from "@/components/Description";

export default async function Home() {
  return (
    <>
      <Hero />
      <Description/>
      <main className="flex-1 flex flex-col gap-6 px-4">
      </main>
    </>
  );
}
