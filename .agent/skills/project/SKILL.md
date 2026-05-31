---
name: project
description: Project-specific architecture, maintenance tasks, and unique conventions. Load when performing project-wide maintenance or working with the core architecture.
---

# Project Context

This skill provides the unique context and architectural details for this repository.

## Purpose

To provide guidance on project-specific structures and tasks that differ from general Obsidian development patterns.

## When to Use

Load this skill when:
- Understanding the repository's unique architecture.
- Performing recurring maintenance tasks.
- Following project-specific coding conventions.

## Project Overview

<!-- 
TIP: Update this section with your project's high-level architecture.
Example:
- **Architecture**: Organized structure with main code in `src/main.ts` and settings in `src/settings.ts`.
- **Reference Management**: Uses a `.ref` folder with symlinks to centralized Obsidian repositories.
-->

- **Primary Stack**: [e.g., TypeScript, Svelte, Lucide icons]
- **Key Directories**: [e.g., src/, styles/, scripts/]

## Core Architecture

- [Detail how primary components interact here]

## Project-Specific Conventions

- **Naming**: [e.g., class names use PascalCase, private methods prefixed with _]
- **Patterns**: [e.g., use of custom stores, specific state management]

## Key Files

- `manifest.json`: Plugin/theme manifest
- `package.json`: Build scripts and dependencies

## Maintenance Tasks

- [e.g., npm run dev to start development server]
- [e.g., npm run version-bump to release new version]
