import StyleDictionary from "style-dictionary";
import config from "../style-dictionary.config.js";

console.log("🎨 Building design tokens...");

const sd = new StyleDictionary(config);

await sd.buildAllPlatforms();

console.log("✅ Design tokens built successfully!");