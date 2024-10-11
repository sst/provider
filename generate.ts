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
  const result =
    await $`pulumi package add terraform-provider ${provider.terraform} ${provider.version}`;
  console.log(result.stdout.toString());
  const path = result.stdout.toString().match(/at (\/[^\n]+)/)[1];
  console.log("path", path);
  process.chdir(path);
  const file = Bun.file("package.json");
  const json = await file.json();
  json.name = name;
  json.version = provider.version;
  json.files = ["bin/", "README.md", "LICENSE"];
  if (provider.suffix) json.version += "-" + provider.suffix;
  await Bun.write(file, JSON.stringify(json, null, 2));
  await $`bun install && bun run build`;
  await $`npm publish --access public`;
}
