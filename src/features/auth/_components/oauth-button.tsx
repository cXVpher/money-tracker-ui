import { Globe } from "@/shared/_components/icons/phosphor";
import { Button } from "@/shared/_components/ui/button";

type OAuthButtonProps = {
  children: React.ReactNode;
};

export function OAuthButton({ children }: OAuthButtonProps) {
  return (
    <Button variant="outline" className="h-11 w-full rounded-full font-semibold">
      <Globe className="h-4 w-4" />
      {children}
    </Button>
  );
}

