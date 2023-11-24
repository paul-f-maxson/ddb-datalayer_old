import { createTable } from "@ddb-datalayer/lib";
import { z } from "zod";

const table = createTable(1)

const transactionDocumentSchema = z.object({
    userId: z.string(),
    transactionId: z.string(),
    transactionTags: z.array(z.string()),
    transactionAmount: z.number(),
    transactionTimestamp: z.number()
});

const transactionSchema = table.createSchema({
    documentSchema: transactionDocumentSchema, 
    keyPaths: {pk: ["userId"], sk: ["transactionTimestamp"], secondaryIndices: {gsi1: {pk: ["userId"], sk: ["transactionAmount"]}}}
})

transactionSchema.makeEntry({
    userId: "paul",
    transactionId: "12345",
    transactionAmount: 100,
    transactionTags: ["grocery"],
    transactionTimestamp: Date.now()
})

