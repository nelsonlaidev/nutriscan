export function createProfileShareFilename(name: string, date = new Date()) {
  const safeName = name
    .toLowerCase()
    .trim()
    .replaceAll(/[^a-z0-9]+/g, '-')
    // eslint-disable-next-line sonarjs/slow-regex
    .replaceAll(/^-+|-+$/g, '')

  const dateStamp = date.toISOString().slice(0, 10)

  return `nutriscan-${safeName || 'profile'}-stats-${dateStamp}.png`
}

export function getWeightGoalDelta(currentWeight: number, goalWeight: number) {
  const delta = Number(Math.abs(currentWeight - goalWeight).toFixed(1))

  if (delta === 0) {
    return {
      delta,
      direction: 'steady' as const,
    }
  }

  return {
    delta,
    direction: currentWeight > goalWeight ? ('down' as const) : ('up' as const),
  }
}
