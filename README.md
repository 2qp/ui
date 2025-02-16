# ui

## What's inside?

This Turborepo includes the following packages/apps:

### Apps

- `docs`: a [Next.js](https://nextjs.org/) app
- `web`: another [Next.js](https://nextjs.org/) app

### Packages

- `@repo/ui`: a stub React component library shared by both `web` and `docs` applications
- `@repo/shadcn-ui`: a customizable React component library based on `radix-ui`
- `@repo/shadcn-ui-extended`: a composed React component library based on `shadcn-ui` and `react-hook-form`
- `@repo/hooks`: custom hooks
---
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### _Navigate_

| Package   | •••       |
| --------- | ------------ |
| shadcn-ui-extended    | [Jump][@repo/shadcn-ui-extended] |
| hooks                 | [Jump][@repo/hooks] |

[@repo/shadcn-ui-extended]: https://github.com/2qp/ui/tree/master/packages/shadcn-ui-extended
[@repo/hooks]: https://github.com/2qp/ui/tree/master/packages/hooks

### Utilities
---
This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)
- [Caching](https://turbo.build/repo/docs/core-concepts/caching)
- [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [Filtering](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)
- [Configuration Options](https://turbo.build/repo/docs/reference/configuration)
- [CLI Usage](https://turbo.build/repo/docs/reference/command-line-reference)

## License

MIT

**Free Software, Hell Yeah!**