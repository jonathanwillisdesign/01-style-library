# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a design tokens library built with Style Dictionary that generates CSS variables, JavaScript exports, and framework-specific font configurations for consistent design system implementation. The project follows a semantic token structure from core → semantic → component-level tokens.

## Architecture

The token architecture follows a three-tier structure:

- **Core tokens**: Base design decisions in `src/tokens/core/` (colors, typography, spacing)
- **Semantic tokens**: Purpose-driven tokens in `src/tokens/semantic/` that reference core values (action, surface, text)
- **Component tokens**: Component-specific overrides and variations

Style Dictionary processes these tokens and generates multiple output formats:
- CSS custom properties for web use
- JavaScript/TypeScript exports for component libraries
- JSON for raw token data
- Platform-specific formats for Next.js, React Native, etc.

## Development Commands

Currently the project has minimal build scripts. Key development tasks include:

- `npm install` - Install dependencies
- Token generation will require Style Dictionary configuration and build scripts

## Dependencies

- **style-dictionary**: Core token transformation and build system
- **typescript**: Type safety and generated TypeScript definitions
- **@types/node**: Node.js type definitions for build scripts

## Token Structure

Tokens should be organized as JSON files with this structure:
```json
{
  "tokenCategory": {
    "tokenName": {
      "value": "#000000",
      "description": "Optional description"
    }
  }
}
```

Core tokens define base values, while semantic tokens reference core tokens using Style Dictionary's reference syntax: `"{category.name.variant}"`.

## Build System

The project will need Style Dictionary configuration to:
- Transform tokens from source JSON to output formats
- Generate CSS custom properties with `--dt-` prefix
- Create JavaScript exports for programmatic access
- Produce TypeScript definitions
- Handle font loading strategies for different platforms

Output directories follow this pattern:
- `build/css/` - CSS custom properties and font declarations
- `build/js/` - JavaScript/TypeScript exports
- `build/json/` - Raw token data

## Integration Patterns

The library is designed to serve as the foundation for a multi-tier design system:
- @your-org/design-tokens (this library)
- @your-org/ui-components (component library)
- @your-org/web-app (application layer)

Components should consume tokens either through CSS variables or direct JavaScript imports for maximum flexibility.