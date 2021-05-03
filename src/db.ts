import faker from "faker";
import { factory, primaryKey, manyOf } from "@mswjs/data";

/** Used to generate unique IDs. */
const idCounter: Record<string, number> = {};

export function generateId(salt = "$lodash$") {
  if (!idCounter[salt]) {
    idCounter[salt] = 0;
  }

  const id = ++idCounter[salt];

  return id;
}

function customerSchema(): any {
  return {
    _pk: primaryKey(faker.datatype.uuid),
    id: () => generateId("customer-id"),
    name: faker.name.findName,
    notes: manyOf("note") as any,
  };
}

function noteSchema(): any {
  return {
    _pk: primaryKey(faker.datatype.uuid),
    id: () => generateId("note-id"),
    description: () => faker.lorem.paragraphs(1),
  };
}

export const db = factory({
  customer: customerSchema(),
  note: noteSchema(),
});
