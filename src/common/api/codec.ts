import * as E from "fp-ts/lib/Either";
import * as TE from "fp-ts/lib/TaskEither";
import { flow } from "fp-ts/lib/function";
import * as t from "io-ts";
import { failure } from "io-ts/lib/PathReporter";

export const decodeWith = <A>(
  decoder: t.Decoder<unknown, A>,
): ((i: unknown) => TE.TaskEither<Error, A>) =>
  flow(
    decoder.decode,
    E.mapLeft((errors) => new Error(failure(errors).join("\n"))),
    TE.fromEither,
  );
