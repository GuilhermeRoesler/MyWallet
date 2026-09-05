import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { DashboardPreview } from "@/components/landing/DashboardPreview";

/** Segunda batida da landing — produto em perspectiva no scroll. */
export function ProductScrollSection() {
  return (
    <section
      aria-labelledby="product-scroll-heading"
      className="relative border-t border-border/40 bg-gradient-to-b from-transparent via-background/40 to-background"
    >
      <ContainerScroll
        titleComponent={
          <div className="mb-6 px-4 md:mb-10">
            <p className="text-sm font-medium tracking-wide text-primary">
              O produto em foco
            </p>
            <h2
              id="product-scroll-heading"
              className="mt-2 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl text-balance"
            >
              Clareza financeira
              <br />
              <span className="text-primary">em cada tela</span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm text-muted-foreground sm:text-base text-balance">
              Role e veja o workspace ganhando presença — saldo, fluxo e
              orçamentos no mesmo ritmo do produto.
            </p>
          </div>
        }
      >
        <DashboardPreview variant="immersive" />
      </ContainerScroll>
    </section>
  );
}
