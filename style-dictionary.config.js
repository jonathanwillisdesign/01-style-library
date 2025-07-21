import StyleDictionary from "style-dictionary";

// Custom transform for kebab-case CSS variables
StyleDictionary.registerTransform({
  name: "name/dt/kebab",
  type: "name",
  filter: () => true,
  transform: (token) => {
    return token.path.join("-").toLowerCase();
  },
});

// Custom format for CSS variables without prefix
StyleDictionary.registerFormat({
  name: "css/variables",
  format: ({ dictionary }) => {
    return `:root {
${dictionary.allTokens
  .map((token) => {
    const name = `--${token.name}`;

    // Handle typography composite tokens
    if (token.type === "typography" && typeof token.value === "object") {
      const typoValue = token.value;
      let cssRules = [];

      if (typoValue.fontFamily)
        cssRules.push(
          `  ${name}-font-family: ${Array.isArray(typoValue.fontFamily) ? typoValue.fontFamily.join(", ") : typoValue.fontFamily};`
        );
      if (typoValue.fontSize)
        cssRules.push(`  ${name}-font-size: ${typoValue.fontSize};`);
      if (typoValue.fontWeight)
        cssRules.push(`  ${name}-font-weight: ${typoValue.fontWeight};`);
      if (typoValue.lineHeight)
        cssRules.push(`  ${name}-line-height: ${typoValue.lineHeight};`);
      if (typoValue.letterSpacing)
        cssRules.push(`  ${name}-letter-spacing: ${typoValue.letterSpacing};`);
      if (typoValue.textCase && typoValue.textCase !== "none")
        cssRules.push(`  ${name}-text-transform: ${typoValue.textCase};`);
      if (typoValue.textDecoration && typoValue.textDecoration !== "none")
        cssRules.push(
          `  ${name}-text-decoration: ${typoValue.textDecoration};`
        );

      return cssRules.join("\n");
    }

    return `  ${name}: ${token.value};`;
  })
  .join("\n")}
}`;
  },
});

// Custom format for typography utility classes using CSS variables
StyleDictionary.registerFormat({
  name: "css/typography-utilities",
  format: ({ dictionary }) => {
    const typographyTokens = dictionary.allTokens.filter(
      (token) => token.type === "typography"
    );

    return typographyTokens
      .map((token) => {
        const className = `.${token.name}`;
        const varName = `--${token.name}`;

        // Use the CSS font shorthand variable and also provide individual properties
        return `${className} {
  font: var(${varName});
}`;
      })
      .join("\n\n");
  },
});

// Custom format for JavaScript/TypeScript exports
StyleDictionary.registerFormat({
  name: "javascript/es6-tokens",
  format: ({ dictionary }) => {
    const tokens = dictionary.allTokens.reduce((acc, token) => {
      const path = token.path.join(".");
      acc[path] = token.value;
      return acc;
    }, {});

    return `export const tokens = ${JSON.stringify(tokens, null, 2)};

export const getCSSVariable = (tokenPath) => {
  const kebabPath = tokenPath.replace(/\\./g, '-');
  return \`var(--dt-\${kebabPath})\`;
};`;
  },
});

export default {
  source: ["src/tokens/**/*.json"],
  platforms: {
    css: {
      transformGroup: "css",
      transforms: ["attribute/cti", "name/dt/kebab", "size/px", "color/css"],
      buildPath: "build/css/",
      files: [
        {
          destination: "variables.css",
          format: "css/variables",
        },
        {
          destination: "typography.css",
          format: "css/typography-utilities",
        },
      ],
    },
    js: {
      transformGroup: "js",
      transforms: ["attribute/cti", "name/dt/kebab", "size/px", "color/css"],
      buildPath: "build/js/",
      files: [
        {
          destination: "tokens.js",
          format: "javascript/es6-tokens",
        },
      ],
    },
    json: {
      transformGroup: "js",
      buildPath: "build/json/",
      files: [
        {
          destination: "tokens.json",
          format: "json/nested",
        },
      ],
    },
  },
};
