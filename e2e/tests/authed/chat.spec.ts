import { expect, test } from '@playwright/test'
import { v4 as uuidv4 } from 'uuid'

import { db } from '@/db'
import { chats } from '@/db/schemas'
import { TEST_USER } from '@/lib/constants'

test('delete chat', async ({ page }) => {
  const id = uuidv4()

  await db.insert(chats).values({
    id,
    title: 'Test chat',
    userId: TEST_USER.id,
  })

  await page.goto('/chat')

  await page.getByTestId('open-chat-history').click()

  await page.getByTestId(`delete-chat-${id}`).click()

  await expect(page.getByTestId('chat-deleted-toast')).toContainText('Chat deleted')
})

test('rename chat from history', async ({ page }) => {
  const id = uuidv4()
  const originalTitle = 'Original chat title'
  const updatedTitle = 'Updated chat title'

  await db.insert(chats).values({
    id,
    title: originalTitle,
    userId: TEST_USER.id,
  })

  await page.goto(`/chat/${id}`)

  await page.getByTestId('open-chat-history').click()
  await page.getByTestId(`edit-chat-${id}`).click()

  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(page.getByText('Edit chat title')).toBeVisible()

  const input = page.getByTestId(`edit-chat-input-${id}`)
  await input.fill(updatedTitle)
  await page.getByTestId(`save-chat-${id}`).click()

  await expect(page.getByTestId('chat-title-updated-toast')).toContainText('Chat title updated')
  await expect(page.getByTestId('chat-title-updated-toast')).toHaveCount(1)
  await expect(page.getByText(updatedTitle).first()).toBeVisible()
  await expect(page.getByRole('heading', { name: updatedTitle })).toBeVisible()
})

test('rename chat rejects blank titles', async ({ page }) => {
  const id = uuidv4()
  const originalTitle = 'Keep this title'

  await db.insert(chats).values({
    id,
    title: originalTitle,
    userId: TEST_USER.id,
  })

  await page.goto(`/chat/${id}`)

  await page.getByTestId('open-chat-history').click()
  await page.getByTestId(`edit-chat-${id}`).click()

  await expect(page.getByRole('dialog')).toBeVisible()

  const input = page.getByTestId(`edit-chat-input-${id}`)
  await input.fill('   ')
  await page.getByTestId(`save-chat-${id}`).click()

  await expect(page.getByText('Please enter a chat title')).toBeVisible()
  await expect(page.getByTestId(`edit-chat-input-${id}`)).toBeVisible()
})
