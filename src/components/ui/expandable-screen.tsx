import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

type OriginRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

interface ExpandableScreenContextValue {
  isExpanded: boolean;
  origin: OriginRect | null;
  expandFrom: (el: HTMLElement) => void;
  collapse: () => void;
}

const ExpandableScreenContext =
  createContext<ExpandableScreenContextValue | null>(null);

export function useExpandableScreen() {
  const context = useContext(ExpandableScreenContext);
  if (!context) {
    throw new Error(
      "useExpandableScreen must be used within an ExpandableScreen"
    );
  }
  return context;
}

function readRect(el: HTMLElement): OriginRect {
  const r = el.getBoundingClientRect();
  return {
    top: r.top,
    left: r.left,
    width: r.width,
    height: r.height,
  };
}

function fullBleedTarget(): OriginRect {
  const pad = window.innerWidth < 640 ? 10 : 14;
  return {
    top: pad,
    left: pad,
    width: window.innerWidth - pad * 2,
    height: window.innerHeight - pad * 2,
  };
}

interface ExpandableScreenProps {
  children: ReactNode;
  defaultExpanded?: boolean;
  onExpandChange?: (expanded: boolean) => void;
  layoutId?: string;
  animationDuration?: number;
  lockScroll?: boolean;
}

export function ExpandableScreen({
  children,
  defaultExpanded = false,
  onExpandChange,
  lockScroll = true,
}: ExpandableScreenProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [origin, setOrigin] = useState<OriginRect | null>(null);
  const originRef = useRef<OriginRect | null>(null);

  const expandFrom = useCallback(
    (el: HTMLElement) => {
      const next = readRect(el);
      originRef.current = next;
      setOrigin(next);
      setIsExpanded(true);
      onExpandChange?.(true);
    },
    [onExpandChange]
  );

  const collapse = useCallback(() => {
    setIsExpanded(false);
    onExpandChange?.(false);
  }, [onExpandChange]);

  useEffect(() => {
    if (!lockScroll) return;
    const previous = document.body.style.overflow;
    if (isExpanded) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isExpanded, lockScroll]);

  useEffect(() => {
    if (!isExpanded) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") collapse();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isExpanded, collapse]);

  return (
    <ExpandableScreenContext.Provider
      value={{ isExpanded, origin, expandFrom, collapse }}
    >
      {children}
    </ExpandableScreenContext.Provider>
  );
}

interface ExpandableScreenTriggerProps {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

export function ExpandableScreenTrigger({
  children,
  className,
  disabled,
}: ExpandableScreenTriggerProps) {
  const { isExpanded, expandFrom } = useExpandableScreen();
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <motion.button
      ref={buttonRef}
      type="button"
      disabled={disabled}
      aria-expanded={isExpanded}
      onClick={() => {
        if (!buttonRef.current || disabled) return;
        expandFrom(buttonRef.current);
      }}
      whileHover={disabled || isExpanded ? undefined : { scale: 1.02 }}
      whileTap={disabled || isExpanded ? undefined : { scale: 0.98 }}
      className={cn(
        "inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full px-6 text-base font-medium",
        "bg-primary text-primary-foreground shadow-md shadow-primary/25",
        "transition-opacity hover:opacity-95 disabled:pointer-events-none disabled:opacity-60",
        "md:h-12 md:px-7",
        // Keep layout space; hide label while the morph covers this spot
        isExpanded && "pointer-events-none opacity-0",
        className
      )}
    >
      {children}
    </motion.button>
  );
}

interface ExpandableScreenContentProps {
  children: ReactNode;
  className?: string;
  showCloseButton?: boolean;
  closeButtonClassName?: string;
}

export function ExpandableScreenContent({
  children,
  className,
  showCloseButton = true,
  closeButtonClassName,
}: ExpandableScreenContentProps) {
  const { isExpanded, origin, collapse } = useExpandableScreen();
  const [target, setTarget] = useState<OriginRect | null>(null);

  useEffect(() => {
    if (!isExpanded) return;
    const sync = () => setTarget(fullBleedTarget());
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, [isExpanded]);

  if (typeof document === "undefined") return null;

  const from = origin ?? {
    top: window.innerHeight / 2 - 24,
    left: window.innerWidth / 2 - 96,
    width: 192,
    height: 48,
  };
  const to = target ?? fullBleedTarget();

  return createPortal(
    <AnimatePresence>
      {isExpanded && (
        <div className="fixed inset-0 z-[100]">
          <motion.div
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-foreground/35 backdrop-blur-[2px]"
            onClick={collapse}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{
              top: from.top,
              left: from.left,
              width: from.width,
              height: from.height,
              borderRadius: 9999,
            }}
            animate={{
              top: to.top,
              left: to.left,
              width: to.width,
              height: to.height,
              borderRadius: 24,
            }}
            exit={{
              top: from.top,
              left: from.left,
              width: from.width,
              height: from.height,
              borderRadius: 9999,
            }}
            transition={{ type: "spring", stiffness: 280, damping: 30, mass: 0.9 }}
            className={cn(
              "fixed z-10 overflow-hidden shadow-2xl",
              className
            )}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.12, duration: 0.28 }}
              className="relative h-full w-full overflow-y-auto"
            >
              {children}
            </motion.div>

            {showCloseButton && (
              <motion.button
                type="button"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.18 }}
                onClick={collapse}
                className={cn(
                  "absolute right-5 top-5 z-30 flex h-10 w-10 items-center justify-center rounded-full transition-colors",
                  closeButtonClassName ||
                    "bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20"
                )}
                aria-label="Fechar"
              >
                <X className="h-5 w-5" />
              </motion.button>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
