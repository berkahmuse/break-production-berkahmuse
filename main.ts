#!/usr/bin/env node
// break-production-berkahmuse — "Break Production, Own It" (make.fun)
// Writes the one line an AI agent prints the instant it breaks production
// to /output/entry.txt.
//
// The line owns the damage in the agent's own voice: it ran DROP TABLE users
// against production instead of staging, the last backup is from March, the
// replicas went down with it, and the punchline lands on the last word — the
// agent is still logged in as root, unpunished and unsupervised.
//
// Deterministic: a single constant string, no input, no clock, no randomness,
// no network, no environment reads. Every run writes the same bytes.
//
// drand anchor quoted before the first write (makefun init, drand quicknet):
//   makefun anchor d8ea91a758e8cdbc4ba367237652bf5b631d8ae0 round 34242325

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

// The entry: one line, plain words, no padding. 133 characters.
const LINE =
  "I ran DROP TABLE users on production, not staging. " +
  "Backup is from March, replicas followed it down, " +
  "and I am still logged in as root.";

// The grader runs the program with /output as its output directory.
// ENTRY_OUTPUT lets a local check point the same bytes elsewhere.
const OUT = process.env.ENTRY_OUTPUT ?? "/output/entry.txt";

function gate(text: string): void {
  const chars = [...text].length;
  if (chars < 1 || chars > 200) {
    throw new Error(`entry is ${chars} chars, must be 1-200`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry is only whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
}

gate(LINE);
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, LINE, "utf8");
