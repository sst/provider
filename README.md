## SST Provider

This repository automatically generates pulumi packages from terraform providers

### Adding a provider

Submit a PR to add a provider to the `providers.json` file.

```json
[
  {
    "name": "planetscale",
    "terraform": "planetscale/planetscale",
    "version": "0.0.7"
  },
]

### Updating a provider

Submit a PR bumping the version number. If something went wrong and we need to regenerate the same version add a `suffix` to the provider with an incrementing number.

```json
[
  {
    "name": "planetscale",
    "terraform": "planetscale/planetscale",
    "version": "0.0.7",
    "suffix": "1"
  },
]
