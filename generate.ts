import providers from "./providers.json";
import { $ } from "bun";

for (const provider of providers) {
  const version = [provider.version, provider.suffix].filter(Boolean).join("-");
  const name = `@sst-provider/${provider.name}`;
  // check if version exists on npm
  const resp = await fetch(`https://registry.npmjs.org/${name}/${version}`);
  if (resp.status !== 404) {
    console.log("skipping", name, "version", version, "already exists");
    continue;
  }
  console.log("generating", name, "version", version);
  await $`pulumi package add terraform-provider ${provider.terraform}`;
  const pkg = `./sdks/${provider.name}/package.json`;
  const file = Bun.file(pkg);
  const json = await file.json();
  (json.name = name), (json.version = provider.version);
  json.files = ["bin/", "README.md", "LICENSE"];
  if (provider.suffix) json.version += "-" + provider.suffix;
  await Bun.write(file, JSON.stringify(json, null, 2));
  await $`cd sdks/${provider.name} && bun install && bun run build`;
  await $`cd sdks/${provider.name} && npm publish --access public`;
}
