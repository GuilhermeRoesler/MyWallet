import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WalletLogo } from "@/components/brand/WalletLogo";
import { DashboardPreview } from "@/components/landing/DashboardPreview";
import { HeroFractalBackdrop } from "@/components/landing/HeroFractalBackdrop";
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
    <div className="relative min-h-screen overflow-hidden mesh-hero text-foreground">
      <HeroFractalBackdrop />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-4 py-5 md:px-6">
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

      <main className="relative z-10 mx-auto grid max-w-6xl items-center gap-10 px-4 pb-20 pt-10 md:gap-12 md:px-6 md:pb-28 md:pt-14 md:grid-cols-[1fr_1.05fr] lg:gap-10 lg:pt-16">
        <div className="max-w-xl">
          <p className="animate-rise mb-3 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="text-primary">My</span> Wallet
          </p>
          <h1 className="animate-rise-delay-1 font-display text-xl font-medium tracking-tight text-foreground sm:text-2xl md:text-[1.85rem] md:leading-snug lg:text-[2.15rem] text-balance">
            Finanças pessoais com a clareza de um produto premium.
          </h1>
          <p className="animate-rise-delay-2 mt-4 max-w-lg text-sm leading-relaxed text-foreground/75 sm:text-base md:text-lg text-balance">
            Contas, orçamentos e relatórios em uma experiência rápida e
            elegante — pronta para explorar em segundos.
          </p>
          <div className="animate-rise-delay-3 mt-7 flex flex-wrap items-center gap-3 md:mt-9">
            <Button
              size="lg"
              className="h-11 px-6 text-base shadow-md shadow-primary/25 md:h-12 md:px-7"
              onClick={openDemo}
              disabled={!initialized}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Explorar agora
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-11 px-6 text-base border-foreground/15 bg-background/80 backdrop-blur-sm md:h-12 md:px-7"
            >
              <Link to="/projetos">
                Ver projetos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="flex justify-center md:justify-end">
          <DashboardPreview />
        </div>
      </main>
    </div>
  );
}
