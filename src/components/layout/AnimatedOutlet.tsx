import { Outlet, useLocation } from "react-router-dom";

/** Remonta o conteúdo da rota para reaplicar a entrada de página. */
export function AnimatedOutlet() {
  const location = useLocation();

  return (
    <div key={location.pathname} className="flex flex-1 flex-col gap-4 animate-page-enter md:gap-8">
      <Outlet />
    </div>
  );
}
