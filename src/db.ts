import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import type { Character, CharacterSummary } from "./types/character";

interface DbSchema extends DBSchema {
  characters: { key: string; value: Character };
}

let _db: Promise<IDBPDatabase<DbSchema>> | null = null;

export function resetDb(): void {
  _db = null;
}

function getDb(): Promise<IDBPDatabase<DbSchema>> {
  if (!_db) {
    _db = openDB<DbSchema>("dbcs", 1, {
      upgrade(db) {
        db.createObjectStore("characters", { keyPath: "id" });
      },
    });
  }
  return _db;
}

export async function getCharacter(id: string): Promise<Character | undefined> {
  return (await getDb()).get("characters", id);
}

export async function putCharacter(character: Character): Promise<void> {
  await (await getDb()).put("characters", character);
}

export async function deleteCharacter(id: string): Promise<void> {
  await (await getDb()).delete("characters", id);
}

export async function getAllCharacterSummaries(): Promise<CharacterSummary[]> {
  const all = await (await getDb()).getAll("characters");
  return all.map(({ id, name, kin, profession, updatedAt }) => ({
    id,
    name,
    kin,
    profession,
    updatedAt,
  }));
}
