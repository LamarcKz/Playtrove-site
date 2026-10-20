import { readFileSync } from "node:fs"
const { docsVersion } = JSON.parse(readFileSync(new URL("./src/data/releases.json", import.meta.url), "utf8"))
export default JSON.parse(readFileSync(new URL(`./versioned_sidebars/version-${docsVersion}-sidebars.json`, import.meta.url), "utf8"))