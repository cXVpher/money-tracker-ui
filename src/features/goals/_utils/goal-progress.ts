export function getGoalProgress(currentAmount: number, targetAmount: number) {
  return Math.round((currentAmount / targetAmount) * 100);
}
