import z from "zod";
import lodash from "lodash";
import { Paths, Get } from "type-fest";

type AllowedGSIs = [
  keyof {},
  "gsi1",
  "gsi1" | "gsi2",
  "gsi1" | "gsi2" | "gsi3",
  "gsi1" | "gsi2" | "gsi3" | "gsi4",
  "gsi1" | "gsi2" | "gsi3" | "gsi4" | "gsi5",
];

const buildTableKey = (paths, document) =>
(new URLSearchParams(
  paths.reduce(
    (acc, path) => ({ ...acc,
      [path]: lodash.get(document, path)
    }),
    {},
  )).toString()
)

export const createTable = <
  GlobalSecondaryIndices extends 0 | 1 | 2 | 3 | 4 | 5,
>(
  globalSecondaryIndices: GlobalSecondaryIndices,
) => ({
  createSchema: <
    S extends z.ZodObject<any>,
    BaseType extends z.infer<S>,
    Path extends Exclude<Paths<BaseType>, number>,
  >({
    documentSchema,
    keyPaths,
  }: {
    documentSchema: S;
    keyPaths: {
      pk: Path[];
      sk?: Path[];
      secondaryIndices?: {
        [gsiName in AllowedGSIs[typeof globalSecondaryIndices]]?: {
          pk: Path[];
          sk?: Path[];
        };
      };
    };
  }) => ({
    makeEntry: (rawDocument: BaseType) => {
      const document = documentSchema.parse(rawDocument);
      return {
        document,
        pk: buildTableKey(keyPaths.pk, document),
        sk: keyPaths.sk
          ? buildTableKey(keyPaths.sk, document)
          : undefined,
        secondaryIndices: keyPaths.secondaryIndices
          ? (
              Object.entries(keyPaths.secondaryIndices) as [
                string,
                { pk: Path; sk?: Path },
              ][]
            ).reduce(
              (secondaryIndexKeys, [gsiName, { pk, sk }]) => ({
                ...secondaryIndexKeys,
                [gsiName]: {
                  pk: buildTableKey(pk, document),
                  sk: sk
                    ? buildTableKey(sk, document)
                    : undefined,
                },
              }),
              {},
            )
          : undefined,
      };
    },
  }),
});
