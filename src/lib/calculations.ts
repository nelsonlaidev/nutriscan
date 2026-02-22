export type Gender = 'male' | 'female' | 'other'

export type CaloriePlan = 'relaxed' | 'steady' | 'accelerated'

const PLAN_DEFICITS: Record<CaloriePlan, number> = {
  relaxed: 250,
  steady: 500,
  accelerated: 750
}

const WEEKLY_LOSS: Record<CaloriePlan, number> = {
  relaxed: 0.25,
  steady: 0.5,
  accelerated: 0.75
}

/**
 * Calculate BMR using the Mifflin-St Jeor equation.
 * For "other" gender, we average the male and female formulas.
 */
export function calculateBMR(weightKg: number, heightCm: number, ageYears: number, gender: Gender): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * ageYears

  if (gender === 'male') return base + 5
  if (gender === 'female') return base - 161

  // "other": average of male and female
  return (base + 5 + (base - 161)) / 2
}

/**
 * Calculate TDEE assuming lightly active (multiplier 1.375).
 */
export function calculateTDEE(bmr: number): number {
  return bmr * 1.375
}

/**
 * Calculate daily calorie budget for a given plan.
 */
export function calculateCalorieBudget(tdee: number, plan: CaloriePlan): number {
  return Math.round(tdee - PLAN_DEFICITS[plan])
}

/**
 * Calculate age from birthday.
 */
export function calculateAge(birthday: string, today: Date = new Date()): number {
  const birth = new Date(birthday)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age -= 1
  }
  return age
}

/**
 * Calculate macro targets from daily calories (balanced split).
 * Protein: 30%, Carbs: 40%, Fat: 30%
 */
export function calculateMacros(calories: number) {
  return {
    protein: Math.round((calories * 0.3) / 4),
    carbs: Math.round((calories * 0.4) / 4),
    fat: Math.round((calories * 0.3) / 9)
  }
}

/**
 * Calculate estimated weeks to reach goal weight.
 */
function calculateWeeksToGoal(currentWeight: number, goalWeight: number, plan: CaloriePlan): number {
  const weightToLose = Math.abs(currentWeight - goalWeight)
  return Math.ceil(weightToLose / WEEKLY_LOSS[plan])
}

/**
 * Get weekly loss rate for a plan.
 */
export function getWeeklyLoss(plan: CaloriePlan): number {
  return WEEKLY_LOSS[plan]
}

/**
 * Generate all plan options given user stats.
 */
export function generatePlanOptions(
  weightKg: number,
  heightCm: number,
  ageYears: number,
  gender: Gender,
  goalWeight: number
) {
  const bmr = calculateBMR(weightKg, heightCm, ageYears, gender)
  const tdee = calculateTDEE(bmr)

  const plans: CaloriePlan[] = ['relaxed', 'steady', 'accelerated']

  return plans.map((plan) => {
    const calories = calculateCalorieBudget(tdee, plan)
    const weeklyLoss = getWeeklyLoss(plan)
    const weeksToGoal = calculateWeeksToGoal(weightKg, goalWeight, plan)

    return {
      plan,
      calories,
      weeklyLoss,
      weeksToGoal
    }
  })
}
