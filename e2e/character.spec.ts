import { expect } from "@playwright/test";
import { test } from "../playwright.config";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

test.describe("Character list", () => {
  test("shows New Character and Import buttons", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("button", { name: "New Character" }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Import" })).toBeVisible();
  });

  test("shows empty state with no characters", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("No characters yet")).toBeVisible();
  });
});

test.describe("Character creation and persistence", () => {
  test("creates a character, fills background, reloads, data persists", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "New Character" }).click();
    await expect(page).toHaveURL(/\/character\/.+\/skills/);

    await page.getByRole("tab", { name: "Background" }).click();
    await page.getByLabel("Name").fill("Elara");
    await page.waitForTimeout(500); // debounce

    await page.reload();
    await expect(page.getByLabel("Name")).toHaveValue("Elara");
  });

  test("stale character URL redirects to home", async ({ page }) => {
    await page.goto("/character/nonexistent-id-99999/skills");
    await expect(page).toHaveURL("/");
  });
});

test.describe("Multi-character", () => {
  test("two characters have independent data", async ({ page }) => {
    await page.goto("/");
    // Create Alice
    await page.getByRole("button", { name: "New Character" }).click();
    await page.getByRole("tab", { name: "Background" }).click();
    await page.getByLabel("Name").fill("Alice");
    await page.waitForTimeout(500);

    // Back to list, create Bob
    await page.getByRole("link", { name: "← Characters" }).click();
    await page.getByRole("button", { name: "New Character" }).click();
    await page.getByRole("tab", { name: "Background" }).click();
    await page.getByLabel("Name").fill("Bob");
    await page.waitForTimeout(500);

    // Back to list — both visible
    await page.getByRole("link", { name: "← Characters" }).click();
    await expect(page.getByText("Alice")).toBeVisible();
    await expect(page.getByText("Bob")).toBeVisible();
  });
});

test.describe("Export / Import", () => {
  test("export then import round-trip preserves name", async ({ page }) => {
    // Create a character
    await page.goto("/");
    await page.getByRole("button", { name: "New Character" }).click();
    await page.getByRole("tab", { name: "Background" }).click();
    await page.getByLabel("Name").fill("Cool Hero");
    await page.waitForTimeout(500);

    // Export from list
    await page.getByRole("link", { name: "← Characters" }).click();
    const charListEntryHeading = page.getByRole("heading", {
      name: "Cool Hero",
    });
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: /Actions for/ }).click();
    await page.getByRole("button", { name: "Export" }).click();

    const download = await downloadPromise;
    expect(await download.failure()).toBeNull();
    const exportPath = await download.path();

    // Delete the character
    await page.getByRole("button", { name: "Delete" }).click();
    await page.getByTestId("confirm-btn").click();
    await expect(charListEntryHeading).toBeHidden();

    // Import from downloaded file
    const fileChooserPromise = page.waitForEvent("filechooser");
    await page.getByRole("button", { name: "Import" }).click();
    const fc = await fileChooserPromise;
    await fc.setFiles(exportPath);
    await expect(page.getByText("Cool Hero")).toBeVisible();
  });

  test("importing invalid JSON shows an error", async ({ page }) => {
    const badFile = join(tmpdir(), "bad-import.json");
    await writeFile(badFile, "{ this is not valid JSON }");

    await page.goto("/");
    const fileChooserPromise = page.waitForEvent("filechooser");
    await page.getByRole("button", { name: "Import" }).click();
    const fc = await fileChooserPromise;
    await fc.setFiles(badFile);

    await expect(page.getByRole("alert")).toBeVisible();
  });
});
