/**
 * Format angka ke format Rupiah Indonesia
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format angka pendek (contoh: 1.5jt, 500rb)
 */
export function formatRupiahShort(amount: number): string {
  if (amount >= 1_000_000_000) {
    return `Rp${(amount / 1_000_000_000).toFixed(1)}M`;
  }
  if (amount >= 1_000_000) {
    return `Rp${(amount / 1_000_000).toFixed(1)}jt`;
  }
  if (amount >= 1_000) {
    return `Rp${(amount / 1_000).toFixed(0)}rb`;
  }
  return `Rp${amount}`;
}

/**
 * Format persentase
 */
export function formatPercentage(value: number): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
}

/**
 * Format tanggal ke format Indonesia
 */
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

/**
 * Format tanggal relatif (contoh: "2 hari lalu")
 */
export function formatRelativeDate(date: Date | string): string {
  const now = new Date();
  const targetDate = new Date(date);
  const diffMs = now.getTime() - targetDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Hari ini";
  if (diffDays === 1) return "Kemarin";
  if (diffDays < 7) return `${diffDays} hari lalu`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu lalu`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} bulan lalu`;
  return `${Math.floor(diffDays / 365)} tahun lalu`;
}
