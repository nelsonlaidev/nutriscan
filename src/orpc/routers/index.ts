import { achievementsRouter } from './achievements.router'
import { chatRouter } from './chat.router'
import { foodRouter } from './food.router'
import { learnRouter } from './learn.router'
import { onboardingRouter } from './onboarding.router'
import { progressRouter } from './progress.router'
import { r2Router } from './r2.router'
import { scanningRouter } from './scanning.router'
import { settingsRouter } from './settings.router'
import { waterRouter } from './water.router'
import { weightRouter } from './weight.router'

export const router = {
  achievements: achievementsRouter,
  chat: chatRouter,
  food: foodRouter,
  learn: learnRouter,
  onboarding: onboardingRouter,
  progress: progressRouter,
  r2: r2Router,
  scanning: scanningRouter,
  settings: settingsRouter,
  water: waterRouter,
  weight: weightRouter,
}
