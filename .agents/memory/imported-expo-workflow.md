---
name: Imported Expo workflow setup
description: Environment setup constraints for imported Expo artifacts in this workspace
---

Imported Expo projects can contain valid `.replit-artifact` metadata without being registered in the Replit workflow registry. In that case, configure one workflow for the existing mobile command rather than creating application changes. A manually configured workflow may not inject the artifact's `PORT`, so pass the declared service port explicitly.

**Why:** An imported project in this workspace had the correct Expo artifact metadata but no registered workflow, and its existing dev script exited because `PORT` was unset.

**How to apply:** Check the workflow registry before restarting an imported artifact. If the managed name is unavailable, configure the single existing Expo workflow using its declared command and port; do not create a second app service or alter application code.

Imported workspaces may also arrive without `node_modules`; run the repository's locked dependency install before typechecking or restarting Expo. The existing lockfile is sufficient and should be preserved.

**Why:** Validation initially failed before application code loaded because `tsc` and `expo` were unavailable, not because of project errors.

**How to apply:** When an imported workflow reports missing local commands, install from the existing lockfile first; do not change package versions or migrate the workspace.