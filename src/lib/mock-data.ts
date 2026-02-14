export const DAILY_GOALS = {
  calories: 2000,
  protein: 150,
  carbs: 250,
  fat: 65,
  fiber: 30
}

export const WATER_GOAL = 8

export const MEAL_CATEGORIES = [
  { id: 'breakfast', name: 'Breakfast', emoji: '🍞', items: 0, calories: 0 },
  { id: 'lunch', name: 'Lunch', emoji: '🌤️', items: 0, calories: 0 },
  { id: 'dinner', name: 'Dinner', emoji: '🌙', items: 0, calories: 0 },
  { id: 'snacks', name: 'Snacks', emoji: '🍿', items: 0, calories: 0 }
] as const
