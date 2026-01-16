import { cn } from "@/lib/utils";

type WalletLogoProps = {
  className?: string;
  title?: string;
};

/** Brand mark — always the same asset as public/icon.png */
export function WalletLogo({ className, title = "My Wallet" }: WalletLogoProps) {
  const src = `${import.meta.env.BASE_URL}icon.png`;

  return (
    <img
      src={src}
      alt={title}
      width={128}
      height={128}
      className={cn("shrink-0 object-contain", className)}
      draggable={false}
    />
  );
}
