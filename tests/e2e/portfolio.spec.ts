import { test, expect } from '@playwright/test';
test('keyboard swipe, undo and persistent likes', async ({ page }) => {
    await page.goto('/');

    // Wait for Astro to hydrate the React application.
    await expect(
        page.locator('astro-island[ssr]')
    ).toHaveCount(0);

    const active = page.locator('[data-card-depth="0"]');
    const like = page.getByRole('button', {
        name: 'Like this project',
        exact: true
    });

    // Initial card.
    await expect(active).toHaveAttribute(
        'data-project-id', 'train-404'
    );
    await expect(like).toBeEnabled();

    // Swipe right.
    await page.keyboard.press('ArrowRight');
    await expect(active).toHaveAttribute(
        'data-project-id', 'wam'
    );
    await expect(like).toBeEnabled();

    // Undo the completed swipe.
    await page.keyboard.press('Control+z');
    await expect(active).toHaveAttribute(
        'data-project-id', 'train-404'
    );
    await expect(like).toBeEnabled();

    // Swipe right again.
    await page.keyboard.press('ArrowRight');
    await expect(active).toHaveAttribute(
        'data-project-id', 'wam'
    );
    await expect(like).toBeEnabled();

    // Verify the saved project.
    await page.getByRole('button', {
        name: /Your likes/
    }).click();

    await expect(page.getByRole('heading', {
        name: /Train 404/
    })).toBeVisible();

    // Verify persistence after reload.
    await page.reload();

    await page.getByRole('button', {
        name: /Your likes/
    }).click();

    await expect(page.getByRole('heading', {
        name: /Train 404/
    })).toBeVisible();
});

test('project profile opens and Escape closes', async ({ page }) => { await page.goto('/?project=wam'); await expect(page.getByRole('dialog')).toBeVisible(); await page.keyboard.press('Escape'); await expect(page.getByRole('dialog')).toHaveCount(0); });

test('mobile navigation and contact draft', async ({ page }) => { await page.setViewportSize({ width: 390, height: 844 }); await page.goto('/'); await page.getByRole('button', { name: 'Chat', exact: true }).click(); await page.getByRole('button', { name: 'I’m hiring an engineer' }).click(); await expect(page.getByRole('textbox', { name: 'Draft your message' })).toHaveValue('I’m hiring an engineer'); });

test('swipe exit fades and promotes the same underlying card', async ({ page }) => {
    await page.goto('/');
    const active = page.locator('[data-card-depth="0"]');
    const next = page.locator('[data-card-depth="1"]');
    await expect(active).toHaveAttribute('data-project-id', 'train-404');
    await next.evaluate(el => el.setAttribute('data-test-preserved', 'yes'));
    await page.keyboard.press('ArrowRight');
    await expect(active).toHaveClass(/card-exiting/);
    await expect(active).toHaveCSS('transition-duration', '0.48s, 0.48s');
    await expect(active).toHaveAttribute('data-project-id', 'wam');
    await expect(active).toHaveAttribute('data-test-preserved', 'yes');
    await expect(active).toHaveCSS('opacity', '1');
});
