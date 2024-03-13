# Publishing @cerberus package to npm registry

`yarn npm publish` should be done only on [gitlab CI](https://gitlab.com/satoshilabs/cerberus/cerberus-suite/-/pipelines/) in `deploy npm` phase.

### Purpose

@cerberus packages are dependencies of `@cerberus/connect` public API.
Publish is required to distribute changes to `@cerberus/connect` and make them available for 3rd party implementations.

### Prerequisites

1. Update `CHANGELOG.md` and list all changes since the last release of the package.
1. Bump the version in `packages/<PACKAGE-NAME>/package.json`. Use the [semver](https://semver.org/) convention.

### Production

1. Create new branch with `npm-release/` prefix.
1. Commit your changes as `release: @cerberus/<PACKAGE-NAME> X.X.X`.
1. Use `<PACKAGE-NAME> deploy npm` job.

### Beta

If you want to publish to npm as `beta` (from any branch) do the following:

1. Change the version in `packages/<PACKAGE-NAME>/package.json` from `X.X.X` to `X.X.(X + 1)-beta.1`.
   The `-beta.<n>` suffix is important because NPM registry doesn't allow overriding already published versions.
   With this suffix we can publish multiple beta versions for a single patch.
1. Commit your changes as `release: @cerberus/<PACKAGE-NAME> X.X.X-beta.X`.
1. Use `beta <PACKAGE-NAME> deploy npm` job.
