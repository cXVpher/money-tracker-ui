import { Globe } from "@/shared/_components/icons/phosphor";
import { Button } from "@/shared/_components/ui/button";

type OAuthButtonProps = {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
};

export function OAuthButton({ children, disabled = false, onClick }: OAuthButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      className="h-11 w-full rounded-full font-semibold"
      disabled={disabled}
      onClick={onClick}
    >
      <Globe className="h-4 w-4" />
      {children}
    </Button>
  );
}

