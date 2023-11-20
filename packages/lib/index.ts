import z from "zod";
import * as lodash from "lodash";
import { Paths, Get } from "type-fest";

const get =
  <S extends z.ZodType<any>>(schema: S) =>
  <BaseType = z.infer<S>>(object: BaseType) =>
  <Path extends Exclude<Paths<BaseType>, number>>(
    path: Path,
  ) =>
    lodash.get(schema.parse(object), path) as Get<
      BaseType,
      Path
    >;

const user = z.object({ username: z.string() });

user.parse({
  username: "paul",
});

get(user)({
  username: "paul",
})("username");
