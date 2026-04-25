export function getBudgetTone(percent: number) {
  if (percent > 90) return "text-destructive";
  if (percent > 70) return "text-warning";
  return "text-success";
}
