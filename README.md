# geom-api-ts-client

![Node.js Package Lint, Test and Publish](https://github.com/nexioinformatica/geom-api-ts-client/workflows/Node.js%20Package%20Lint,%20Test%20and%20Publish/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/nexioinformatica/geom-api-ts-client/badge.svg)](https://coveralls.io/github/nexioinformatica/geom-api-ts-client)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/nexioinformatica/geom-api-ts-client.svg)
![GitHub repo size](https://img.shields.io/github/repo-size/nexioinformatica/geom-api-ts-client.svg)
![npm](https://img.shields.io/npm/dm/geom-api-ts-client.svg)
![npm](https://img.shields.io/npm/dt/geom-api-ts-client.svg)
![NPM](https://img.shields.io/npm/l/geom-api-ts-client.svg)
![npm](https://img.shields.io/npm/v/geom-api-ts-client.svg)
![GitHub last commit](https://img.shields.io/github/last-commit/nexioinformatica/geom-api-ts-client.svg)
![npm collaborators](https://img.shields.io/npm/collaborators/geom-api-ts-client.svg)

A TypeScript client library for accessing GeOM APIs

## Install

```bash
yarn add geom-api-ts-client

# or, with npm
npm i geom-api-ts-client
```

## Usage

```typescript
import { Operator } from "geom-api-ts-client";

const result = Operator.getMe(config);
// use result ...
```

Go to the [examples](#examples) section for more.

## Endpoints

Here follows the list of implemented endpoints, with reference to the
latest API docs.

| n   | name                                  | endpoint \[^1\]                                | method                                  |
| --- | ------------------------------------- | ---------------------------------------------- | --------------------------------------- |
| 1   | token                                 | /token                                         | `Authentication.login`                  |
| 2   | barcode                               | /barcode-decode                                | `Barcode.decode`                        |
| 3   | operator collection                   | /operatori                                     | `Operator.collection`                   |
| 4   | operator me                           | /operatori/me                                  | `Operator.me`                           |
| 5   | operator single                       | /operatori/{id}                                | `Operator.single`                       |
| 6   | operator activity                     | /operatori/{id}/attivita                       | `Activity.collectionByOperator`         |
| 7   | machine collection                    | /macchine                                      | `Machine.collection`                    |
| 8   | machine single                        | /macchine/{id}                                 | `Machine.single`                        |
| 9   | machine activity                      | /macchine/{id}/attivita                        | `Activity.collectionByMachine`          |
| 23  | article subdivisions                  | /articoli/{id}/suddivisioni                    | `Subdivision.collectionByArticle`       |
| 27  | article subdivision details           | /articoli-suddivisioni/{subdivisionId}         | `Subdivision.single`                    |
| 32  | freshman subdivisions                 | /articoli-matricole/{freshmanId}/suddivisioni  | `Subdivision.collectionByFreshman`      |
| 34  | new article subdivision               | /articoli-suddivisioni                         | `Subdivision.create`                    |
| 37  | movement reason collection            | /causali-magazzino                             | `Warehouse.Reason.getCollection`        |
| 41  | activity types collection             | /tipi-attivita                                 | `Activities.ActivityType.getCollection` |
| 44  | create warehouse movement             | /movimenti-magazzino                           | `Warehouse.Movement.create`             |
| 46  | check action action phase             | /fasi-lavorazione/{id}/check-action            | `Job.checkAction`                       |
| 48  | start activity                        | /attivita/start                                | `Activity.start`                        |
| 49  | stop activity by machine              | /attivita-macchine/{machineActivityId}/stop    | `Activity.stopByMachineActivity`        |
| 50  | stop activity by machine and operator | /attivita-macchine/{machineActivityId}/stopall | `Activity,stopAllByMachineActivity`     |
| 51  | stop activity by operator             | /attivita-operatori/{operatorActivityId}/stop  | `Activity.stopByOperatorActivity`       |
| 52  | end job                               | /fasi-lavorazione/{id}/fine                    | `Job.end`                               |
| 57  | shape collection                      | /forme                                         | `Shape.collection`                      |
| 58  | shape details                         | /forma/{id}                                    | `Shape.single`                          |
| 59  | job phase search by name              | /fasi-lavorazione/fasecomune/{name}            | `Job.byName`                            |

\[^1\]: version is excluded from endpoint url

## Tests

```
yarn test
yarn lint

# or, with docker
docker-compose build  # needed the fitst time
docker-compose run yarn yarn test
docker-compose run yarn yarn lint
```

## Examples

**Functional style**

```typescript
import * as TE from "fp-ts/lib/TaskEither";
import { pipe } from "fp-ts/lib/pipeable";
import { Operator } from "geom-api-ts-client";

pipe(
  Operator.getMe({
    token: "my-token-123",
    settings: { url: "www.myurl.com" },
  }),
  TE.fold(
    (err) => {
      // handle the error
    }),
    (operator) => {
      // handle the result
    })),
)();
```

**Promise style**

```typescript
import * as TE from "fp-ts/lib/TaskEither";
import { pipe } from "fp-ts/lib/pipeable";
import { Operator } from "geom-api-ts-client";

export const toResultTask = <E, A>(te: TE.TaskEither<E, A>): T.Task<A> =>
  pipe(
    te,
    teFold(
      (err) => () => Promise.reject(err),
      (res) => tOf(res),
    ),
  );

pipe(
  Operator.getMe({
    token: "my-token-123",
    settings: { url: "www.foo.com" },
  }),
  toResultTask,
)()
  .then((operator) => {
    // handle the result
  })
  .catch((err) => {
    // handle the error
  });
```

**Avoid callback hell**

You can make related api calls with easy functional programming
features.

```typescript
const settings = { url: "www.foo.com" };

const activitiesByOperator = (settings: Settings) => (
  operator: Operator.Operator,
) =>
  pipe(
    {
      IdOperatore: operator.IdOperatore,
      settings: settings,
    },
    Activities.collectionByOperator,
  );

const getMe = (settings: Settings) => Operator.getMe(settings);

pipe(
  getMe({ settings: settings }),
  TE.chain(activitiesByOperator({ settings: settings })),
  // You may continue chaining calls
);
```

## Credits

- [Luca Parolari](https://github.com/lparolari)
- [All contributors](https://github.com/nexioinformatica/geom-api-ts-client/contributors)

## License

The project is MIT licensed. See [LICENSE](LICENSE) file.
