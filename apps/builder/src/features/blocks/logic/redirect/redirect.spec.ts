import test, { expect } from '@playwright/test'
import { typebotViewer } from 'utils/playwright/testHelpers'
import { importTypebotInDatabase } from 'utils/playwright/databaseActions'
import { createId } from '@paralleldrive/cuid2'
import { getTestAsset } from '@/test/utils/playwright'

const typebotId = createId()

test.describe('Redirect block', () => {
  test('its configuration should work', async ({ page, context }) => {
    await importTypebotInDatabase(
      getTestAsset('typebots/logic/redirect.json'),
      {
        id: typebotId,
      }
    )

    await page.goto(`/typebots/${typebotId}/edit`)
    await page.click('text=Configure...')
    await page.fill('input[placeholder="Type a URL..."]', 'google.com')

    await page.click('text=Preview')
    await typebotViewer(page).locator('text=Go to URL').click()
    await expect(page).toHaveURL('https://www.google.com')
    await page.goBack()

    await page.click('text=Redirect to google.com')
    await page.click('text=Open in new tab')

    await page.click('text=Preview')
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      typebotViewer(page).locator('text=Go to URL').click(),
    ])
    await newPage.waitForLoadState()
    await expect(newPage).toHaveURL('https://www.google.com')
  })
})
