import { expect, test, type Page } from "@playwright/test";

const cell = (page: Page, index: number) => page.getByTestId(`cell-${index}`);

let errors: string[] = [];

test.beforeEach(async ({ page }) => {
  errors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(err.message));
  await page.goto("/");
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();
});

test.afterEach(() => {
  expect(errors).toEqual([]);
});

test("PvP: win a game, verify result and score, start a new game", async ({ page }) => {
  await expect(page.getByRole("heading", { name: "Tic-Tac-Toe" })).toBeVisible();
  await expect(page.getByRole("radio", { name: "Player vs Player" })).toBeChecked();
  const status = page.getByTestId("game-status");
  await expect(status).toHaveText("Player X's turn");

  for (const i of [0, 3, 1, 4, 2]) await cell(page, i).click();

  await expect(status).toHaveText("Player X wins!");
  for (const i of [0, 1, 2]) await expect(cell(page, i)).toHaveAttribute("data-winning", "true");
  await expect(page.getByTestId("score-X")).toHaveText("1");
  await expect(page.getByRole("dialog", { name: "Game over" })).toBeVisible();

  await page.reload();
  await expect(page.getByTestId("score-X")).toHaveText("1");

  await page.getByRole("button", { name: "New Game" }).click();
  await expect(status).toHaveText("Player X's turn");
  for (let i = 0; i < 9; i++) await expect(cell(page, i)).toHaveAttribute("aria-label", /empty$/);
  await expect(page.getByTestId("score-X")).toHaveText("1");

  await page.getByRole("button", { name: "Reset Score" }).click();
  await expect(page.getByTestId("score-X")).toHaveText("0");
});

test("PvC: computer responds to each human move", async ({ page }) => {
  await page.getByText("Player vs Computer").click();
  await page.getByText("Hard").click();
  const status = page.getByTestId("game-status");

  await cell(page, 0).click();
  await expect(cell(page, 0)).toHaveAttribute("aria-label", "Row 1, Column 1, X");
  await expect(cell(page, 4)).toHaveAttribute("aria-label", "Row 2, Column 2, O");
  await expect(status).toHaveText("Player X's turn");

  await cell(page, 8).click();
  await expect(page.locator('[aria-label$=", O"]')).toHaveCount(2);
  await expect(status).toHaveText("Player X's turn");
});

test("keyboard: play with arrow keys and Enter", async ({ page }) => {
  await cell(page, 0).focus();
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("Enter");
  await expect(cell(page, 1)).toHaveAttribute("aria-label", "Row 1, Column 2, X");
  await expect(cell(page, 1)).toBeFocused();
});
