# tuuru-chrono-tz Setup Guide

Complete setup guide for developing tuuru-chrono-tz.

---

## 🚀 Quick Start

```bash
# Navigate to project
cd tuuru-chrono-tz

# Install dependencies
pnpm install

# Download and parse IANA timezone data
pnpm build-tzdata

# Build TypeScript
pnpm build

# Run tests
pnpm test
```

---

## 📋 Prerequisites

### Required

- **Node.js**: >= 18.0.0
- **pnpm**: >= 9.1.0 (recommended package manager)

### Installation

```bash
# Install pnpm (if not installed)
npm install -g pnpm

# Or using corepack (Node.js 16.9+)
corepack enable
corepack prepare pnpm@9.1.0 --activate
```

---

## 🔧 Project Setup

### 1. Clone Repository

```bash
git clone https://github.com/yedoma-labs/tuuru-chrono-tz.git
cd tuuru-chrono-tz
```

### 2. Install Dependencies

```bash
pnpm install
```

This will install:
- TypeScript 5.4+
- Type definitions for Node.js
- Development tools

---

## 🌍 IANA Timezone Data

The library requires IANA timezone data to function. This data must be downloaded and parsed before building.

### Download IANA Data

```bash
# Download latest version
pnpm download-iana

# Or specify version
pnpm download-iana 2024a
```

**What it does**:
- Downloads from https://data.iana.org/time-zones/releases/
- Extracts timezone data files (africa, asia, europe, etc.)
- Saves to `data/iana/`

**Files downloaded**:
- `africa`, `antarctica`, `asia`, `australasia`, `europe`, `northamerica`, `southamerica` - Zone definitions
- `backward` - Timezone aliases
- `zone1970.tab` - Timezone metadata (countries, coordinates)
- `iso3166.tab` - Country codes
- `VERSION` - Data version

### Parse IANA Data

```bash
pnpm parse-iana
```

**What it does**:
- Parses all zone files
- Extracts zones, rules, and links
- Generates TypeScript files in `src/tzdata/`:
  - `timezones.ts` - All 400+ timezone names
  - `data.ts` - Timezone rules and offsets
  - `data.json` - Raw timezone data
  - `index.ts` - Public API

**Output**:
```
src/tzdata/
├── timezones.ts    (400+ timezone names)
├── data.ts         (TypeScript interfaces)
├── data.json       (Raw IANA data)
└── index.ts        (Exports)
```

### Build Everything

```bash
# Download + parse in one command
pnpm build-tzdata
```

---

## 🔨 Building

### TypeScript Compilation

```bash
# Build ESM + CommonJS
pnpm build

# Clean before build
pnpm clean && pnpm build
```

**Output**: `dist/`
- `*.js` - ESM modules
- `*.cjs` - CommonJS modules
- `*.d.ts` - TypeScript declarations
- `*.d.cts` - CommonJS declarations

### Build Configuration

**ESM Build**: `tsconfig.json`
```json
{
  "compilerOptions": {
    "module": "ESNext",
    "target": "ES2022"
  }
}
```

**CommonJS Build**: `tsconfig.cjs.json`
```json
{
  "compilerOptions": {
    "module": "CommonJS",
    "moduleResolution": "node"
  }
}
```

---

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test --watch
```

### Writing Tests

Place tests in `src/**/*.test.ts`:

```typescript
import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { DateTime } from './datetime.js';

test('DateTime.now() creates current time', () => {
  const dt = DateTime.now();
  assert.ok(dt.isValid());
});
```

---

## 📂 Project Structure

```
tuuru-chrono-tz/
├── src/
│   ├── datetime.ts        # Main DateTime class
│   ├── duration.ts        # Duration class
│   ├── timezone.ts        # Timezone utilities
│   ├── types.ts           # TypeScript types
│   ├── tzdata/            # Generated IANA data
│   │   ├── timezones.ts   # 400+ timezone names
│   │   ├── data.ts        # Timezone rules
│   │   ├── data.json      # Raw data
│   │   └── index.ts       # Exports
│   └── index.ts           # Main entry point
│
├── scripts/
│   ├── download-iana.js   # Download IANA tzdata
│   └── parse-iana.js      # Parse and generate TS
│
├── data/
│   ├── iana/              # Downloaded IANA files
│   └── tzdata.tar.gz      # Downloaded archive
│
├── dist/                  # Compiled output (ESM + CJS)
│
├── package.json           # Package manifest
├── tsconfig.json          # TypeScript config (ESM)
├── tsconfig.cjs.json      # TypeScript config (CJS)
├── README.md              # Main documentation
└── SETUP.md               # This file
```

---

## 🛠️ Development Workflow

### 1. Initial Setup

```bash
pnpm install
pnpm build-tzdata
pnpm build
```

### 2. Make Changes

Edit files in `src/`:
- `datetime.ts` - DateTime implementation
- `duration.ts` - Duration implementation
- `timezone.ts` - Timezone utilities

### 3. Build & Test

```bash
pnpm build
pnpm test
```

### 4. Update IANA Data (when needed)

```bash
# Check for new version at https://www.iana.org/time-zones
pnpm download-iana 2024b  # New version
pnpm parse-iana
pnpm build
```

---

## 📦 Package Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `download-iana` | `node scripts/download-iana.js` | Download IANA tzdata |
| `parse-iana` | `node scripts/parse-iana.js` | Parse IANA data to TS |
| `build-tzdata` | Downloads + parses | Complete IANA setup |
| `build` | `tsc && tsc -p tsconfig.cjs.json` | Build ESM + CJS |
| `test` | `node --test` | Run tests |
| `clean` | `rm -rf dist` | Remove build output |

---

## 🐛 Troubleshooting

### "Cannot find module './tzdata'"

**Problem**: IANA data not generated

**Solution**:
```bash
pnpm build-tzdata
```

### "tar: command not found"

**Problem**: `tar` not available (Windows)

**Solution**: Install tar via:
- Git Bash (includes tar)
- WSL (Windows Subsystem for Linux)
- Cygwin

**Or** manually extract `data/tzdata.tar.gz`

### "HTTP 404" when downloading

**Problem**: IANA version doesn't exist

**Solution**: Check available versions at:
https://data.iana.org/time-zones/releases/

```bash
# Use latest
pnpm download-iana
```

### Build fails with TypeScript errors

**Problem**: TypeScript version mismatch

**Solution**:
```bash
# Ensure correct TypeScript version
pnpm add -D typescript@5.4.0

# Clean and rebuild
pnpm clean
pnpm build
```

---

## 🔄 Updating IANA Timezone Data

IANA releases new timezone data several times per year.

### Check Current Version

```bash
cat data/iana/VERSION
# → 2024a
```

### Update to Latest

```bash
# Download latest
pnpm download-iana

# Parse
pnpm parse-iana

# Rebuild
pnpm build

# Test
pnpm test
```

### Update to Specific Version

```bash
pnpm download-iana 2024b
pnpm parse-iana
pnpm build
```

---

## 🎯 Next Steps

1. ✅ Complete setup (`pnpm install && pnpm build-tzdata`)
2. 📖 Read [README.md](README.md) for API documentation
3. 🔍 Review [research](../ideas/KEM-TIME-PAIN-POINTS-ANALYSIS.md)
4. 💻 Start implementing features
5. 🧪 Write tests
6. 📦 Build and publish

---

## 📚 Additional Resources

- [IANA Time Zone Database](https://www.iana.org/time-zones)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [pnpm Documentation](https://pnpm.io/)
- [Pain Points Research](../ideas/KEM-TIME-PAIN-POINTS-ANALYSIS.md)

---

**Questions?** Open an issue on GitHub!
