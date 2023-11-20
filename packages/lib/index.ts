import z from "zod";
import lodash from "lodash";
import { Paths, Get } from "type-fest";

type AllowedGSIs = [never, "gsi1", "gsi1" | "gsi2", "gsi1" | "gsi2" | "gsi3", "gsi1" | "gsi2" | "gsi3" | "gsi4", "gsi1" | "gsi2" | "gsi3" | "gsi4" | "gsi5" ]

export const createTable = (globalSecondaryIndices: 0 | 1 | 2 | 3 | 4 | 5) => ({
  createSchema: <S extends z.ZodType<any>, BaseType extends z.infer<S>, Path extends Exclude<Paths<BaseType>, number>>(documentSchema: S,
      keyPaths: {
        pk: Path,
        sk?: Path,
        secondaryIndexPaths?: {[gsiPath in AllowedGSIs[typeof globalSecondaryIndices]]?: {pk: Path, sk?: Path}}
      },
    ) => ({
     makeEntry: (document: BaseType) => ({
      document,
      pk: 
        lodash.get(documentSchema.parse(document), keyPaths.pk) as Get<
          BaseType,
          Path
        >,
      sk: 
        keyPaths.sk ? lodash.get(documentSchema.parse(document), keyPaths.sk) as Get<
          BaseType,
          Path
        > : undefined,
      secondaryIndices: keyPaths.secondaryIndexPaths? Object.entries(keyPaths.secondaryIndexPaths).reduce((acc, [indexName, {pk, sk}]) => ({...acc, [indexName]: {
        pk: 
        lodash.get(documentSchema.parse(document), pk) as Get<
          BaseType,
          Path
        >,
      sk: 
        sk ? lodash.get(documentSchema.parse(document), sk) as Get<
          BaseType,
          Path
        > : undefined,
      }}), {}) : undefined
      }),
      
  })});

  // ERROR: gsi2 should bot be allowed here
  createTable(1).createSchema(z.object({userName: z.string(), age: z.number()}), {pk: "userName", secondaryIndexPaths: {gsi1: {pk: "age"}, gsi2: {pk: "age"}}})

