import { AnimatedOutlet } from "./AnimatedOutlet";
import { Navbar } from "./Navbar";
import { AppDock } from "./AppDock";

export function DashboardLayout() {
  return (
    <div className="relative flex min-h-screen w-full flex-col surface-atmosphere">
      <Navbar />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-28 pt-4 sm:px-6 md:pb-32 md:pt-6 lg:px-8">
        <AnimatedOutlet />
      </main>
      <AppDock />
    </div>
  );
}
