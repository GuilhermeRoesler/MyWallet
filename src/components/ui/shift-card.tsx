import * as React from "react";
import { AnimatePresence, motion, type MotionProps } from "motion/react";
import { cn } from "@/lib/utils";

interface ShiftCardProps
  extends Omit<MotionProps, "onAnimationStart" | "onAnimationComplete"> {
  className?: string;
  topContent?: React.ReactNode;
  middleContent?: React.ReactNode;
  topAnimateContent?: React.ReactNode;
  bottomContent?: React.ReactNode;
}

const ShiftCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => (
  <div ref={ref} {...props}>
    {children}
  </div>
));
ShiftCardHeader.displayName = "ShiftCardHeader";

interface ShiftCardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  isHovered: boolean;
}

const ShiftCardContent = React.forwardRef<
  HTMLDivElement,
  ShiftCardContentProps
>(({ isHovered, children, className }, ref) => {
  const motionProps: MotionProps = {
    initial: { opacity: 0, height: 0 },
    animate: isHovered
      ? { opacity: 1, height: 168 }
      : { opacity: 1, height: 44 },
    transition: { duration: 0.28, delay: 0.05, ease: "circIn" },
  };

  return (
    <motion.div
      key="shift-card-content"
      ref={ref}
      {...motionProps}
      className={className}
    >
      {children}
    </motion.div>
  );
});
ShiftCardContent.displayName = "ShiftCardContent";

const ShiftCard = React.forwardRef<HTMLDivElement, ShiftCardProps>(
  (
    {
      className,
      topContent,
      topAnimateContent,
      middleContent,
      bottomContent,
      ...props
    },
    ref
  ) => {
    const [isHovered, setHovered] = React.useState(false);

    return (
      <motion.div
        ref={ref}
        className={cn(
          "group relative flex min-h-[280px] w-full flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card p-3 text-sm shadow-sm",
          "hover:cursor-pointer",
          className
        )}
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        whileHover={{ scale: 1.015, y: -2 }}
        transition={{ type: "spring", stiffness: 380, damping: 28 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        {...props}
      >
        <ShiftCardHeader className="relative flex h-[52px] w-full flex-col text-foreground">
          <div className="w-full">
            {topContent}
            <AnimatePresence>
              {isHovered ? <>{topAnimateContent}</> : null}
            </AnimatePresence>
          </div>
        </ShiftCardHeader>

        <div className="pb-14">
          <AnimatePresence>
            {!isHovered ? <>{middleContent}</> : null}
          </AnimatePresence>
        </div>

        <ShiftCardContent
          isHovered={isHovered}
          className="absolute -bottom-1 left-0 right-0 flex flex-col gap-3 rounded-2xl border-t border-border/60 bg-card/95 px-3 pb-3 pt-2 backdrop-blur-sm"
        >
          <motion.div className="flex w-full flex-col gap-2">
            {bottomContent}
          </motion.div>
        </ShiftCardContent>
      </motion.div>
    );
  }
);

ShiftCard.displayName = "ShiftCard";

export { ShiftCard, ShiftCardHeader, ShiftCardContent };
export default ShiftCard;
