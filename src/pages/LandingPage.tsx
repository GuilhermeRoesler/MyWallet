import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ChevronDown,
  Sparkles,
  Wallet,
  PiggyBank,
  LineChart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { WalletLogo } from "@/components/brand/WalletLogo";
import { DashboardPreview } from "@/components/landing/DashboardPreview";
import { HeroFractalBackdrop } from "@/components/landing/HeroFractalBackdrop";
import { ProductScrollSection } from "@/components/landing/ProductScrollSection";
import {
  ExpandableScreen,
  ExpandableScreenContent,
  ExpandableScreenTrigger,
  useExpandableScreen,
} from "@/components/ui/expandable-screen";
import { useProjectStore } from "@/store/projectStore";
import { useEffect } from "react";

function DemoLaunchPanel({ ready }: { ready: boolean }) {
  const navigate = useNavigate();
  const { collapse } = useExpandableScreen();
  const { resetDemoProject } = useProjectStore();

  const enter = () => {
    const demo = resetDemoProject();
    collapse();
    navigate(`/project/${demo.id}`);
  };

  return (
    <div className="flex min-h-full flex-col justify-between px-6 py-10 text-center sm:px-10 md:px-14 md:py-14">
      <div className="flex justify-center">
        <WalletLogo className="h-12 w-12 drop-shadow-md md:h-14 md:w-14" />
      </div>

      <div className="mx-auto flex w-full max-w-2xl flex-col items-center">
        <p className="font-display text-4xl font-semibold tracking-tight text-primary-foreground sm:text-5xl md:text-6xl">
          Pronto para explorar?
        </p>
        <p className="mt-4 max-w-lg text-base text-primary-foreground/80 sm:text-lg text-balance">
          Abra o workspace de exemplo com contas, orçamentos e temas — tudo local,
          sem cadastro.
        </p>

        <ul className="mt-10 grid w-full gap-3 text-left sm:grid-cols-3">
          {[
            { icon: Wallet, label: "Contas e saldo" },
            { icon: PiggyBank, label: "Orçamentos vivos" },
            { icon: LineChart, label: "Relatórios claros" },
          ].map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="flex items-center gap-2.5 rounded-2xl bg-primary-foreground/10 px-4 py-3.5 text-sm text-primary-foreground/90"
            >
              <Icon className="h-4 w-4 shrink-0 opacity-90" />
              {label}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-8">
        <Button
          size="lg"
          disabled={!ready}
          onClick={enter}
          className="h-12 bg-primary-foreground px-8 text-base text-primary hover:bg-primary-foreground/90"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Entrar na demo
        </Button>
        <Button
          size="lg"
          variant="ghost"
          onClick={collapse}
          className="h-12 text-base text-primary-foreground/85 hover:bg-primary-foreground/10 hover:text-primary-foreground"
        >
          Voltar
        </Button>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const { init, initialized } = useProjectStore();

  useEffect(() => {
    init();
  }, [init]);

  return (
    <div className="relative text-foreground">
      <div className="relative min-h-screen overflow-hidden mesh-hero">
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

        <main className="relative z-10 mx-auto grid max-w-6xl items-center gap-10 px-4 pb-24 pt-10 md:gap-12 md:px-6 md:pb-32 md:pt-14 md:grid-cols-[1fr_1.05fr] lg:gap-10 lg:pt-16">
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
            <div className="mt-7 flex flex-wrap items-center gap-3 md:mt-9 animate-rise-delay-3">
              <ExpandableScreen>
                <ExpandableScreenTrigger disabled={!initialized}>
                  <Sparkles className="h-4 w-4" />
                  Explorar agora
                </ExpandableScreenTrigger>
                <ExpandableScreenContent className="bg-primary text-primary-foreground shadow-2xl">
                  <DemoLaunchPanel ready={initialized} />
                </ExpandableScreenContent>
              </ExpandableScreen>
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

        <a
          href="#produto"
          className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1.5 text-foreground/45 transition-colors hover:text-foreground/70 animate-fade-in"
          aria-label="Rolar para conhecer o produto"
        >
          <span className="text-[10px] font-medium uppercase tracking-[0.18em]">
            Explorar
          </span>
          <ChevronDown className="h-4 w-4 animate-scroll-hint" aria-hidden />
        </a>
      </div>

      <ProductScrollSection />
    </div>
  );
}
