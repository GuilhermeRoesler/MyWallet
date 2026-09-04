import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { WalletLogo } from "@/components/brand/WalletLogo";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404: rota inexistente:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 surface-atmosphere px-4">
      <WalletLogo className="h-12 w-12 opacity-80" />
      <div className="text-center space-y-2">
        <p className="font-display text-6xl font-semibold text-primary">404</p>
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          Página não encontrada
        </h1>
        <p className="text-muted-foreground">
          Esse caminho não existe neste app.
        </p>
      </div>
      <Button asChild>
        <Link to="/">Voltar ao início</Link>
      </Button>
    </div>
  );
};

export default NotFound;
