import type { InferRouterInputs, InferRouterOutputs, RouterClient } from '@orpc/server'
import type { router } from './routers'

import { createORPCClient } from '@orpc/client'
import { RPCLink } from '@orpc/client/fetch'
import { createTanstackQueryUtils } from '@orpc/tanstack-query'

import { IS_SERVER } from '@/lib/constants'

declare global {
  var $client: RouterClient<typeof router> | undefined
}

const link = new RPCLink({
  url: () => {
    if (IS_SERVER) {
      throw new Error('RPCLink is not allowed on the server side.')
    }

    return `${globalThis.location.origin}/rpc`
  },
})

export const client: RouterClient<typeof router> = globalThis.$client ?? createORPCClient(link)
export const orpc = createTanstackQueryUtils(client)

type Inputs = InferRouterInputs<typeof router>
type Outputs = InferRouterOutputs<typeof router>

export type ListFoodByCategoryInput = Inputs['food']['listByCategory']
export type GetFoodByIdInput = Inputs['food']['getById']

export type CalorieChartInput = Inputs['progress']['calorieChart']
export type NutritionChartInput = Inputs['progress']['nutritionChart']
export type WaterChartInput = Inputs['progress']['waterChart']
export type WeightByDateRangeInput = Inputs['progress']['weightByDateRange']
export type GetLearnLessonInput = Inputs['learn']['getLesson']

export type GetTotalWaterInput = Inputs['water']['total']
export type GetWaterEntriesInput = Inputs['water']['list']

export type GetFoodTotalsInput = Inputs['food']['totals']
export type GetFoodMealsInput = Inputs['food']['meals']

export type ListChatOutput = Outputs['chat']['list']
export type LearnOverviewOutput = Outputs['learn']['overview']
export type SubmitLearnAttemptOutput = Outputs['learn']['submitAttempt']
