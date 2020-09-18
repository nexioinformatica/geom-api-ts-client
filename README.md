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

## Usage

Install the package 

```bash
yarn add geom-api-ts-client

# or, with npm
npm i geom-api-ts-client
```

and start coding

```typescript
import { Operator } from "geom-api-ts-client";

const result = Operator.getMe(config)
// use result ...
```

## Test

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
