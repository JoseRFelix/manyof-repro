import { setupWorker, rest } from "msw";
import { db } from "./db";

const worker = setupWorker(
  rest.get("/customer", (req, res, ctx) => {
    const notes = [db.note.create(), db.note.create(), db.note.create()];
    const customer = db.customer.create({
      notes,
    });

    console.log(Object.getOwnPropertyDescriptors(customer));

    return res(ctx.status(202, "Mocked Status"), ctx.json(customer));
  }),
  rest.patch("/notes", (req, res, ctx) => {
    const { customerId, noteId, description } = req.body as Record<string, any>;

    const updatedNote = db.note.update({
      data: {
        description,
      },
      where: {
        id: {
          equals: noteId,
        },
      },
      strict: true,
    });

    console.log("updated note", updatedNote);

    const customer = db.customer.findFirst({
      where: {
        id: {
          equals: customerId,
        },
      },
      strict: true,
    });
    console.log("Customer Notes", customer!.notes);
    console.log("All notes", db.note.getAll());

    return res(ctx.status(200, "Mocked Status"), ctx.json(customer!.notes));
  })
);
worker.start();
