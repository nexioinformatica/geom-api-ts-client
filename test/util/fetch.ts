import { pipe } from "fp-ts/lib/function";
import { Task } from "fp-ts/lib/Task";
import { TaskEither, fold } from "fp-ts/lib/TaskEither";
import { taskFail, taskOf } from "./common";

export const mockFetch = <T>(apiCall: () => TaskEither<Error, T>): Task<T> =>
  pipe(apiCall(), fold(taskFail, taskOf));
