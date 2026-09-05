import { useRef } from "react";
import { NavLink, useParams } from "react-router-dom";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { getDockNavItems, type AppNavItem } from "./nav-items";

const ICON_SIZE = 40;
const MAGNIFY_DISTANCE = 140;
const MAGNIFY_MAX = 56;

function DockIcon({
  mouseX,
  item,
}: {
  mouseX: MotionValue<number>;
  item: AppNavItem;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const Icon = item.icon;

  const distance = useTransform(mouseX, (x) => {
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds || !Number.isFinite(x)) return MAGNIFY_DISTANCE;
    return x - bounds.x - bounds.width / 2;
  });

  const sizeSync = useTransform(
    distance,
    [-MAGNIFY_DISTANCE, 0, MAGNIFY_DISTANCE],
    [ICON_SIZE, MAGNIFY_MAX, ICON_SIZE],
  );
  const size = useSpring(sizeSync, { mass: 0.12, stiffness: 180, damping: 16 });

  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <NavLink
          to={item.href}
          end={item.end}
          aria-label={item.title}
          className="group relative flex rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {({ isActive }) => (
            <motion.div
              ref={ref}
              style={{ width: size, height: size }}
              className="relative flex items-center justify-center"
            >
              <span
                className={cn(
                  "flex h-full w-full items-center justify-center rounded-xl border transition-colors duration-200",
                  isActive
                    ? "border-primary/35 bg-primary text-primary-foreground shadow-sm"
                    : "border-transparent bg-muted/70 text-muted-foreground group-hover:bg-muted group-hover:text-foreground",
                )}
              >
                <Icon className="h-[42%] w-[42%] shrink-0" strokeWidth={2.1} />
              </span>
              <span
                className={cn(
                  "absolute -bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary transition-opacity",
                  isActive ? "opacity-100" : "opacity-0",
                )}
              />
            </motion.div>
          )}
        </NavLink>
      </TooltipTrigger>
      <TooltipContent side="top" sideOffset={10} className="hidden sm:block">
        {item.title}
      </TooltipContent>
    </Tooltip>
  );
}

type AppDockProps = {
  /** Quando false, o dock desce e some. */
  visible?: boolean;
};

export function AppDock({ visible = true }: AppDockProps) {
  const { projectId } = useParams<{ projectId: string }>();
  const items = getDockNavItems(projectId);
  const mouseX = useMotionValue(Number.POSITIVE_INFINITY);

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          key="app-dock"
          aria-label="Navegação principal"
          initial={{ y: 96, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 96, opacity: 0 }}
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
          className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2"
        >
          <motion.div
            onMouseMove={(e) => mouseX.set(e.pageX)}
            onMouseLeave={() => mouseX.set(Number.POSITIVE_INFINITY)}
            className="pointer-events-auto flex max-w-[calc(100vw-1.5rem)] items-end gap-1 overflow-x-auto rounded-2xl border border-border/70 bg-background/80 px-2 py-2 shadow-lg shadow-foreground/8 ring-1 ring-foreground/5 backdrop-blur-xl sm:gap-1.5 sm:overflow-visible sm:px-2.5 sm:py-2.5"
          >
            {items.map((item) => (
              <DockIcon key={item.id} mouseX={mouseX} item={item} />
            ))}
          </motion.div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
