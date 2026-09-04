import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WalletLogo } from "@/components/brand/WalletLogo";
import { useProjectStore } from "@/store/projectStore";
import { useEffect } from "react";

export default function LandingPage() {
  const navigate = useNavigate();
  const { init, initialized, resetDemoProject } = useProjectStore();

  useEffect(() => {
    init();
  }, [init]);

  const openDemo = () => {
    const demo = resetDemoProject();
    navigate(`/project/${demo.id}`);
  };

  return (
    <div className="min-h-screen mesh-hero text-foreground">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 md:px-6">
        <Link to="/" className="flex items-center gap-2.5 animate-fade-in">
          <WalletLogo className="h-8 w-8" />
          <span className="font-display text-xl font-semibold tracking-tight">
            My Wallet
          </span>
        </Link>
        <Button asChild variant="ghost" className="animate-fade-in">
          <Link to="/projetos">Meus projetos</Link>
        </Button>
      </header>

      <main className="relative mx-auto flex max-w-6xl flex-col px-4 pb-24 pt-16 md:px-6 md:pb-32 md:pt-24 lg:pt-28">
        <div className="max-w-2xl">
          <p className="animate-rise mb-4 font-display text-5xl font-semibold tracking-tight text-foreground sm:text-6xl md:text-7xl">
            <span className="text-primary">My</span> Wallet
          </p>
          <h1 className="animate-rise-delay-1 font-display text-2xl font-medium tracking-tight text-foreground sm:text-3xl md:text-[2.15rem] md:leading-snug text-balance">
            Finanças pessoais com a clareza de um produto premium.
          </h1>
          <p className="animate-rise-delay-2 mt-5 max-w-lg text-base leading-relaxed text-foreground/75 md:text-lg text-balance">
            Contas, orçamentos e relatórios no navegador — sem backend, com
            dados locais e uma experiência pensada para impressionar.
          </p>
          <div className="animate-rise-delay-3 mt-9 flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              className="h-12 px-7 text-base shadow-md shadow-primary/25"
              onClick={openDemo}
              disabled={!initialized}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Abrir demo
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 px-7 text-base border-foreground/15 bg-background/80 backdrop-blur-sm">
              <Link to="/projetos">
                Ver projetos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute right-4 top-20 hidden w-[44%] max-w-md animate-rise-delay-2 lg:block xl:right-6"
        >
          <div className="rotate-[-4deg] rounded-2xl border border-border/60 bg-card/80 p-4 shadow-2xl shadow-foreground/10 backdrop-blur-md">
            <div className="mb-3 flex items-center justify-between">
              <div className="h-2 w-24 rounded-full bg-primary/30" />
              <div className="h-2 w-10 rounded-full bg-muted-foreground/20" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border bg-background/80 p-3">
                <div className="h-2 w-16 rounded-full bg-muted-foreground/25" />
                <div className="mt-2 font-display text-xl font-semibold tabular-nums text-primary">
                  R$&nbsp;51k
                </div>
                <div className="mt-3 h-8 w-full rounded bg-gradient-to-r from-primary/20 to-transparent" />
              </div>
              <div className="rounded-xl border bg-background/80 p-3">
                <div className="h-2 w-14 rounded-full bg-muted-foreground/25" />
                <div className="mt-2 font-display text-xl font-semibold tabular-nums">
                  −R$&nbsp;3,2k
                </div>
                <div className="mt-3 flex gap-1">
                  {[40, 55, 35, 70, 45, 80].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-sm bg-destructive/25"
                      style={{ height: `${h * 0.12}rem` }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-3 h-20 rounded-xl border bg-gradient-to-t from-primary/15 via-primary/5 to-transparent" />
          </div>
        </div>
      </main>
    </div>
  );
}
