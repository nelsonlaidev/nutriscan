import type { Locale } from 'next-intl'

import { ImageResponse } from 'next/og'
import { getTranslations } from 'next-intl/server'

import { getSession } from '@/lib/auth'
import { getWeightGoalDelta } from '@/lib/profile/share'
import { getProfileShareSnapshot } from '@/lib/profile/share.server'
import { formatMl } from '@/lib/utils'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await getSession()

  if (!session) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { user } = session

  try {
    const locale = user.locale as Locale
    const [snapshot, t] = await Promise.all([
      getProfileShareSnapshot(user.id),
      getTranslations({ locale, namespace: 'profile' }),
    ])

    const metricFormatter = new Intl.NumberFormat(locale, {
      maximumFractionDigits: 1,
    })
    const integerFormatter = new Intl.NumberFormat(locale, {
      maximumFractionDigits: 0,
    })
    const memberSince = new Intl.DateTimeFormat(locale, {
      month: 'short',
      year: 'numeric',
    }).format(new Date(String(user.createdAt)))
    const { delta, direction } = getWeightGoalDelta(user.currentWeight, user.goalWeight)

    const goalLabel =
      direction === 'steady'
        ? t('share.goal-reached')
        : t(`share.goal-progress.${direction}`, {
            value: metricFormatter.format(delta),
          })

    const overviewCards = [
      {
        label: t('current-weight'),
        value: `${metricFormatter.format(user.currentWeight)} kg`,
      },
      {
        label: t('goal-weight'),
        value: `${metricFormatter.format(user.goalWeight)} kg`,
      },
      {
        label: t('height'),
        value: `${metricFormatter.format(user.height)} cm`,
      },
      {
        label: t('share.daily-calorie-budget'),
        value: `${integerFormatter.format(user.calorieBudget)} kcal`,
      },
      {
        label: t('share.water-goal'),
        value: formatMl(user.waterGoal),
      },
    ]

    const progressCards = [
      {
        label: t('share.badges'),
        value: `${integerFormatter.format(snapshot.unlockedAchievements)}/${integerFormatter.format(snapshot.totalAchievements)}`,
      },
      {
        label: t('share.lessons'),
        value: `${integerFormatter.format(snapshot.completedLessons)}/${integerFormatter.format(snapshot.totalLessons)}`,
      },
      {
        label: t('share.meal-streak'),
        value: t('share.streak-days', { count: snapshot.mealStreak }),
      },
      {
        label: t('share.water-streak'),
        value: t('share.streak-days', { count: snapshot.waterStreak }),
      },
    ]

    return new ImageResponse(
      <div
        style={{
          background: '#f5f5f1',
          color: '#182025',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          width: '100%',
          padding: '40px',
        }}
      >
        <div
          style={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #dde2da',
              borderRadius: '999px',
              color: '#2f6b57',
              display: 'flex',
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: '0.1em',
              padding: '12px 18px',
            }}
          >
            NutriScan
          </div>
          <div style={{ color: '#687076', display: 'flex', fontSize: 24 }}>
            {t('member-since')} {memberSince}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flex: 1,
            gap: '22px',
            marginTop: '22px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flex: 1,
              flexDirection: 'column',
              gap: '22px',
            }}
          >
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #dde2da',
                borderRadius: '32px',
                display: 'flex',
                flexDirection: 'column',
                padding: '30px',
              }}
            >
              <div style={{ color: '#687076', display: 'flex', fontSize: 24 }}>{t('share.photo-kicker')}</div>
              <div
                style={{
                  display: 'flex',
                  fontSize: 66,
                  fontWeight: 700,
                  letterSpacing: '-0.04em',
                  lineHeight: 1,
                  marginTop: '12px',
                }}
              >
                {user.name}
              </div>
              <div style={{ color: '#44515a', display: 'flex', fontSize: 28, marginTop: '18px' }}>{goalLabel}</div>
            </div>

            <div
              style={{
                background: '#ffffff',
                border: '1px solid #dde2da',
                borderRadius: '32px',
                display: 'flex',
                flexDirection: 'column',
                padding: '24px',
              }}
            >
              <div
                style={{
                  color: '#687076',
                  display: 'flex',
                  fontSize: 18,
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                }}
              >
                {t('share.overview-title')}
              </div>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '14px',
                  marginTop: '18px',
                }}
              >
                {overviewCards.map((card) => (
                  <div
                    key={card.label}
                    style={{
                      background: '#f7f8f5',
                      border: '1px solid #e7ebe5',
                      borderRadius: '22px',
                      display: 'flex',
                      flex: '1 1 220px',
                      flexDirection: 'column',
                      minHeight: '108px',
                      padding: '18px',
                    }}
                  >
                    <div
                      style={{
                        color: '#6b7480',
                        display: 'flex',
                        fontSize: 16,
                      }}
                    >
                      {card.label}
                    </div>
                    <div
                      style={{
                        color: '#182025',
                        display: 'flex',
                        fontSize: 34,
                        fontWeight: 700,
                        letterSpacing: '-0.03em',
                        marginTop: '10px',
                      }}
                    >
                      {card.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            style={{
              background: '#ffffff',
              border: '1px solid #dde2da',
              borderRadius: '32px',
              display: 'flex',
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '28px',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  color: '#687076',
                  display: 'flex',
                  fontSize: 18,
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                }}
              >
                {t('share.stats-title')}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '18px' }}>
                {progressCards.map((card) => (
                  <div
                    key={card.label}
                    style={{
                      alignItems: 'center',
                      background: '#f7f8f5',
                      border: '1px solid #e7ebe5',
                      borderRadius: '22px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '18px 20px',
                    }}
                  >
                    <div style={{ color: '#6b7480', display: 'flex', fontSize: 22 }}>{card.label}</div>
                    <div style={{ display: 'flex', fontSize: 28, fontWeight: 700 }}>{card.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                alignItems: 'center',
                display: 'flex',
                marginTop: '20px',
              }}
            >
              <div style={{ color: '#687076', display: 'flex', fontSize: 20 }}>
                {t('share.generated-with-nutriscan')}
              </div>
            </div>
          </div>
        </div>
      </div>,
      {
        headers: {
          'cache-control': 'no-store, max-age=0',
        },
        height: 860,
        width: 1200,
      },
    )
  } catch {
    return new Response('Failed to generate share image', { status: 500 })
  }
}
