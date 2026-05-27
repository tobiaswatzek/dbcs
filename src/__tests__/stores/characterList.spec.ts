import { beforeEach, describe, expect, it, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useCharacterListStore } from "../../stores/characterList";
import type { CharacterSummary } from "../../types/character";

vi.mock("../../db", () => ({
  getAllCharacterSummaries: vi.fn().mockResolvedValue([]),
  deleteCharacter: vi.fn().mockResolvedValue(undefined),
}));

beforeEach(() => setActivePinia(createPinia()));

describe("useCharacterListStore", () => {
  it("starts empty and unloaded", () => {
    const s = useCharacterListStore();
    expect(s.summaries).toEqual([]);
    expect(s.isLoaded).toBe(false);
  });

  it("loadSummaries populates from db", async () => {
    const { getAllCharacterSummaries } = await import("../../db");
    vi.mocked(getAllCharacterSummaries).mockResolvedValueOnce([
      { id: "1", name: "Alice", kin: "Elf", profession: "Mage", updatedAt: "" },
    ]);
    const s = useCharacterListStore();
    await s.loadSummaries();
    expect(s.summaries).toHaveLength(1);
    expect(s.isLoaded).toBe(true);
  });

  it("addSummary appends", () => {
    const s = useCharacterListStore();
    const summary: CharacterSummary = {
      id: "1",
      name: "Bob",
      kin: "Human",
      profession: "Fighter",
      updatedAt: "",
    };
    s.addSummary(summary);
    expect(s.summaries).toContainEqual(summary);
  });

  it("removeCharacter calls db and removes from list", async () => {
    const s = useCharacterListStore();
    s.addSummary({
      id: "1",
      name: "X",
      kin: "",
      profession: "",
      updatedAt: "",
    });
    await s.removeCharacter("1");
    expect(s.summaries).toHaveLength(0);
  });

  it("updateSummary replaces matching summary", () => {
    const s = useCharacterListStore();
    s.addSummary({
      id: "1",
      name: "Old",
      kin: "",
      profession: "",
      updatedAt: "",
    });
    s.updateSummary({
      id: "1",
      name: "New",
      kin: "",
      profession: "",
      updatedAt: "",
    });
    expect(s.summaries[0].name).toBe("New");
  });
});
