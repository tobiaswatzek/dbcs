import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { exportCharacterAsJson } from "../../utils/export";
import { createBlankCharacter } from "../../utils/character";
import type { Character } from "../../types/character";

describe("exportCharacterAsJson", () => {
  let anchor: HTMLAnchorElement;

  beforeEach(() => {
    anchor = document.createElement("a");
    vi.spyOn(anchor, "click").mockImplementation(() => {});
    vi.spyOn(document, "createElement").mockReturnValue(anchor as any);
    vi.spyOn(document.body, "appendChild").mockReturnValue(anchor as any);
    vi.spyOn(document.body, "removeChild").mockReturnValue(anchor as any);
    vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:mock");
    vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});
  });

  afterEach(() => vi.restoreAllMocks());

  function makeChar(name: string): Character {
    return {
      ...createBlankCharacter(),
      id: "x",
      updatedAt: "2026-01-01T00:00:00.000Z",
      name,
    };
  }

  it("sets download filename to character name + .json", () => {
    exportCharacterAsJson(makeChar("Elara"));
    expect(anchor.download).toBe("Elara.json");
  });

  it('falls back to "character.json" when name is empty', () => {
    exportCharacterAsJson(makeChar(""));
    expect(anchor.download).toBe("character.json");
  });

  it("triggers a click on the anchor", () => {
    exportCharacterAsJson(makeChar("Hero"));
    expect(anchor.click).toHaveBeenCalled();
  });
});
