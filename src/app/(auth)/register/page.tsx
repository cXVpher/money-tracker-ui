"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { UserPlus } from "@/shared/_components/icons/phosphor";
import { toast } from "sonner";
import { AuthCard } from "@/features/auth/_components/auth-card";
import { OAuthButton } from "@/features/auth/_components/oauth-button";
import { Button } from "@/shared/_components/ui/button";
import { USE_MOCK_DATA } from "@/shared/_config/runtime";
import { Input } from "@/shared/_components/ui/input";
import { Label } from "@/shared/_components/ui/label";
import { ApiClientError } from "@/shared/_utils/api-client";
import { register } from "@/shared/_utils/backend-client";
import { registerMockAccount } from "@/shared/_utils/mock-auth";

type RegisterField = "email" | "name" | "password" | "phone" | "referralCode";
type RegisterFieldErrors = Partial<Record<RegisterField, string>>;
type RegisterFormValues = {
  email: string;
  name: string;
  password: string;
  phone: string;
  referralCode: string;
};

const registerFieldLabels: Record<RegisterField, string> = {
  email: "Email",
  name: "Nama",
  password: "Password",
  phone: "Nomor WhatsApp",
  referralCode: "Kode Referral",
};

const backendFieldMap: Record<string, RegisterField> = {
  email: "email",
  name: "name",
  password: "password",
  phone: "phone",
  referral_code: "referralCode",
};

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [fieldErrors, setFieldErrors] = useState<RegisterFieldErrors>({});
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

  const formValues = {
    email,
    name,
    password,
    phone,
    referralCode,
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setHasAttemptedSubmit(true);

    const nextFieldErrors = validateRegisterForm(formValues);
    setFieldErrors(nextFieldErrors);

    if (Object.keys(nextFieldErrors).length > 0) {
      toast.error("Periksa kembali data registrasi.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (USE_MOCK_DATA) {
        registerMockAccount({
          email,
          name,
          password,
          phone,
        });
        toast.success("Akun mock berhasil dibuat dan langsung login.");
        router.push("/dashboard");
        return;
      }

      await register({
        email,
        name,
        password,
        phone,
        referralCode,
      });
      toast.success("Registrasi berhasil.");
      router.push("/dashboard");
    } catch (error) {
      if (error instanceof ApiClientError) {
        const backendFieldErrors = getRegisterFieldErrorsFromApi(error);

        if (Object.keys(backendFieldErrors).length > 0) {
          setFieldErrors(backendFieldErrors);
        }
      }

      const message =
        error instanceof ApiClientError
          ? error.message
          : "Registrasi gagal. Coba lagi.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleGoogleRegister() {
    if (USE_MOCK_DATA) {
      toast.info("Google register aktif saat NEXT_PUBLIC_MOCK_DATA=false.");
      return;
    }

    setIsGoogleSubmitting(true);
    await signIn("google", {
      callbackUrl: "/dashboard",
    });
  }

  function updateField(field: RegisterField, value: string) {
    const nextValues = {
      ...formValues,
      [field]: value,
    };

    if (field === "name") {
      setName(value);
    } else if (field === "phone") {
      setPhone(value);
    } else if (field === "email") {
      setEmail(value);
    } else if (field === "password") {
      setPassword(value);
    } else {
      setReferralCode(value);
    }

    if (hasAttemptedSubmit || fieldErrors[field]) {
      setFieldErrors(validateRegisterForm(nextValues));
    }
  }

  function validateField(field: RegisterField) {
    const error = validateRegisterField(field, formValues[field]);

    setFieldErrors((currentErrors) => {
      const nextErrors = { ...currentErrors };

      if (error) {
        nextErrors[field] = error;
      } else {
        delete nextErrors[field];
      }

      return nextErrors;
    });
  }

  return (
    <AuthCard
      title="Buat Akun Baru"
      description="Mulai catat transaksi dan lihat arus kas dalam beberapa menit."
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="name">Nama</Label>
          <Input
            id="name"
            placeholder="Nama lengkap"
            className="h-11"
            value={name}
            onBlur={() => validateField("name")}
            onChange={(event) => updateField("name", event.target.value)}
            aria-describedby={fieldErrors.name ? "name-error" : undefined}
            aria-invalid={Boolean(fieldErrors.name)}
          />
          <FieldError id="name-error" message={fieldErrors.name} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Nomor WhatsApp</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="628123456789"
            className="h-11"
            value={phone}
            onBlur={() => validateField("phone")}
            onChange={(event) => updateField("phone", event.target.value)}
            aria-describedby={fieldErrors.phone ? "phone-error" : undefined}
            aria-invalid={Boolean(fieldErrors.phone)}
          />
          <FieldError id="phone-error" message={fieldErrors.phone} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="nama@email.com"
            className="h-11"
            value={email}
            onBlur={() => validateField("email")}
            onChange={(event) => updateField("email", event.target.value)}
            aria-describedby={fieldErrors.email ? "email-error" : undefined}
            aria-invalid={Boolean(fieldErrors.email)}
          />
          <FieldError id="email-error" message={fieldErrors.email} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Minimal 8 karakter"
            className="h-11"
            value={password}
            onBlur={() => validateField("password")}
            onChange={(event) => updateField("password", event.target.value)}
            aria-describedby={fieldErrors.password ? "password-error" : undefined}
            aria-invalid={Boolean(fieldErrors.password)}
          />
          <FieldError id="password-error" message={fieldErrors.password} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="referral-code">Kode Referral</Label>
          <Input
            id="referral-code"
            placeholder="Opsional"
            className="h-11"
            value={referralCode}
            onBlur={() => validateField("referralCode")}
            onChange={(event) => updateField("referralCode", event.target.value)}
            aria-describedby={
              fieldErrors.referralCode ? "referral-code-error" : undefined
            }
            aria-invalid={Boolean(fieldErrors.referralCode)}
          />
          <FieldError id="referral-code-error" message={fieldErrors.referralCode} />
        </div>
        <Button
          type="submit"
          className="h-11 w-full rounded-full font-semibold"
          disabled={isSubmitting}
        >
          <UserPlus className="h-4 w-4" />
          {isSubmitting ? "Memproses..." : "Daftar Gratis"}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        atau
        <span className="h-px flex-1 bg-border" />
      </div>

      <OAuthButton
        disabled={USE_MOCK_DATA || isGoogleSubmitting}
        onClick={() => void handleGoogleRegister()}
      >
        {USE_MOCK_DATA
          ? "Google aktif saat mode API"
          : isGoogleSubmitting
            ? "Menghubungkan..."
            : "Daftar dengan Google"}
      </OAuthButton>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Sudah punya akun?{" "}
        <Link href="/login" className="font-semibold text-primary">
          Masuk
        </Link>
      </p>
    </AuthCard>
  );
}

function validateRegisterForm(values: RegisterFormValues): RegisterFieldErrors {
  return (Object.keys(registerFieldLabels) as RegisterField[]).reduce(
    (errors, field) => {
      const error = validateRegisterField(field, values[field]);

      if (error) {
        errors[field] = error;
      }

      return errors;
    },
    {} as RegisterFieldErrors
  );
}

function validateRegisterField(field: RegisterField, value: string) {
  const trimmedValue = value.trim();

  if (field === "name") {
    if (!trimmedValue) {
      return "Nama wajib diisi.";
    }

    if (trimmedValue.length < 2 || trimmedValue.length > 100) {
      return "Nama minimal 2 karakter dan maksimal 100 karakter.";
    }
  }

  if (field === "phone") {
    if (!trimmedValue) {
      return "Nomor WhatsApp wajib diisi.";
    }

    if (!/^628\d+$/.test(trimmedValue)) {
      return "Gunakan format 628xxx, contoh 628123456789.";
    }
  }

  if (field === "email" && trimmedValue && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue)) {
    return "Masukkan format email yang valid.";
  }

  if (field === "password") {
    if (!trimmedValue) {
      return "Password wajib diisi.";
    }

    if (trimmedValue.length < 8) {
      return "Password minimal 8 karakter.";
    }
  }

  return undefined;
}

function getRegisterFieldErrorsFromApi(error: ApiClientError): RegisterFieldErrors {
  if (!isValidationErrorDetails(error.details)) {
    return {};
  }

  return Object.entries(error.details.errors).reduce((fieldErrors, [key, value]) => {
    const field = backendFieldMap[key];

    if (field && typeof value === "string") {
      fieldErrors[field] = value;
    }

    return fieldErrors;
  }, {} as RegisterFieldErrors);
}

function isValidationErrorDetails(
  details: unknown
): details is { errors: Record<string, unknown> } {
  return (
    typeof details === "object" &&
    details !== null &&
    "errors" in details &&
    typeof details.errors === "object" &&
    details.errors !== null
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <p id={id} className="text-xs font-medium text-destructive">
      {message}
    </p>
  );
}

