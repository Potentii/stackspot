# Stackspot JS SDK - Examples

This folder contains minimal, single-file examples for common use cases.
Each script is designed to be simple and heavily commented to help you
get started quickly.

## Prerequisites
- Node.js 18+
- Valid Stackspot credentials
- Environment variables set (recommended):
  - `STACKSPOT_CLIENT_ID`
  - `STACKSPOT_CLIENT_SECRET`
  - `STACKSPOT_REALM`

Alternatively, you can configure credentials directly in code (see the
first example).

## How to run
From the project root, run any script with Node:

```bash
node ./examples/01-config-and-auth.mjs
```

If you installed the package from npm in another project, replace imports
of `../main.mjs` with `import { Stackspot } from 'stackspot'`.

## Examples
1. `01-config-and-auth.mjs`: Configure credentials and fetch an access token.
2. `02-ks-create.mjs`: Create a new Knowledge Source.
3. `03-ks-upload.mjs`: Upload a new object (file content) to a Knowledge Source.
4. `04-ks-batch-remove.mjs`: Batch-remove objects from a Knowledge Source.
5. `05-quick-command-create-execution.mjs`: Trigger a Quick Command execution.
6. `06-quick-command-get-execution.mjs`: Fetch the status/result of a Quick Command execution.
7. `07-quick-command-poll-execution.mjs`: Create and poll a Quick Command execution until it finishes.
8. `08-agents-send-prompt.mjs`: Send a non-streaming prompt to an Agent.
9. `09-agents-send-prompt-streaming.mjs`: Send a streaming prompt to an Agent and consume partial output.

## Tips
- When running examples that require existing resources (e.g., KS slug,
  Quick Command slug, Agent ID), update the placeholder values at the
  top of the script.
- If you are behind a corporate proxy, check the main README for how to
  set a custom HTTP agent (e.g., using `proxy-agent`).
