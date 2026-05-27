import { beforeEach, describe, expect, it, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useCharacterStore } from "../../stores/character";
import { createBlankCharacter } from "../../utils/character";
import type { Character } from "../../types/character";

const mockChar = (): Character => ({
  ...createBlankCharacter(),
  id: "1",
  updatedAt: "2026-01-01T00:00:00.000Z",
  name: "Alice",
});

vi.mock("../../db", () => ({
  getCharacter: vi.fn(),
  putCharacter: vi.fn().mockResolvedValue(undefined),
}));

beforeEach(() => setActivePinia(createPinia()));

describe("useCharacterStore", () => {
  it("starts with null character", () => {
    const s = useCharacterStore();
    expect(s.character).toBeNull();
    expect(s.isLoaded).toBe(false);
  });

  it("loadCharacter returns true and sets character", async () => {
    const { getCharacter } = await import("../../db");
    vi.mocked(getCharacter).mockResolvedValueOnce(mockChar());
    const s = useCharacterStore();
    expect(await s.loadCharacter("1")).toBe(true);
    expect(s.character?.name).toBe("Alice");
    expect(s.isLoaded).toBe(true);
  });

  it("loadCharacter returns false when not found", async () => {
    const { getCharacter } = await import("../../db");
    vi.mocked(getCharacter).mockResolvedValueOnce(undefined);
    const s = useCharacterStore();
    expect(await s.loadCharacter("missing")).toBe(false);
    expect(s.character).toBeNull();
  });

  it("clearCharacter resets to null", async () => {
    const { getCharacter } = await import("../../db");
    vi.mocked(getCharacter).mockResolvedValueOnce(mockChar());
    const s = useCharacterStore();
    await s.loadCharacter("1");
    s.clearCharacter();
    expect(s.character).toBeNull();
    expect(s.isLoaded).toBe(false);
  });
});
