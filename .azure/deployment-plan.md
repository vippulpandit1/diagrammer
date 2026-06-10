# Azure Deployment Plan — R_js_draw (Graphic Workspace)

**Status:** Ready for Validation

---

## Application Summary

| Field | Value |
|-------|-------|
| Name | r-js-draw (Graphic Workspace) |
| Type | React SPA (static frontend only) |
| Build tool | Vite |
| Runtime | None (pure static HTML/JS/CSS after build) |
| Existing Dockerfile | Yes — multi-stage Node build → nginx serve |
| Backend / API | None |
| Database | None |
| External services | None (MCP/Claude SDK used client-side) |

---

## Deployment Mode

**MODIFY** — Add Azure infrastructure files to an existing project.

---

## Target Azure Service

**Azure Static Web Apps** (recommended)

Rationale:
- The app is a pure SPA with no server-side backend
- Static Web Apps natively supports Vite / React SPAs with zero server config
- Automatic global CDN, SSL certificate, custom domains, preview environments per PR
- Free tier available; Standard tier adds custom auth and advanced routing
- Simpler and cheaper than running the existing nginx Docker container on Container Apps

**Alternative considered:** Azure Container Apps (using existing Dockerfile)
- Valid option if user needs the nginx container unchanged
- Higher cost and operational overhead vs. Static Web Apps for a pure SPA
- Can be selected instead if user prefers the container-based approach

---

## Infrastructure Plan

| Resource | Service | SKU | Purpose |
|----------|---------|-----|---------|
| Static Web App | Azure Static Web Apps | Free (or Standard) | Host SPA |
| Resource Group | — | — | Logical container |

| Location | `westus2` |
| Environment | `dev` |

---

## Deployment Tooling

**Azure Developer CLI (azd)** with a minimal `azure.yaml` + Bicep template.

- `azure.yaml` — declares the SPA service
- `infra/main.bicep` — provisions the Static Web App
- `infra/main.parameters.json` — parameterises location / environment name
- No Dockerfile changes required (Static Web Apps builds from source, not the Dockerfile)

---

## Files to Create

| File | Purpose |
|------|---------|
| `azure.yaml` | AZD project configuration |
| `infra/main.bicep` | Bicep: Resource Group + Static Web App |
| `infra/main.parameters.json` | Deployment parameters |
| `.azure/deployment-plan.md` | This file |

---

## Build Configuration for Static Web Apps

| Setting | Value |
|---------|-------|
| App location | `/` (root) |
| Output location | `dist` |
| Build command | `npm run build` |
| API location | (empty — no API) |

---

## Assumptions / Open Questions

1. **Azure Subscription** — User must provide subscription ID or be logged in via `az login` / `azd auth login`
2. **Location** — Defaulting to `eastus2`; user can change
3. **Environment name** — Defaulting to `dev`
4. **Tier** — Free tier; upgrade to Standard if custom auth or advanced routing is needed
5. **Container option** — If user prefers Azure Container Apps (using the existing Dockerfile), that path can be taken instead

---

## Steps

- [x] Phase 1: Plan approved by user
- [x] Phase 2.1: Generate `azure.yaml`
- [x] Phase 2.2: Generate `infra/main.bicep`
- [x] Phase 2.3: Generate `infra/main.parameters.json`
- [x] Phase 2.4: Verify `npm run build` produces `dist/` — ✅ 126 modules, 1.59s
- [x] Phase 2.5: Exclude test files from `tsconfig.app.json` so production build passes
- [x] Phase 2.6: Update plan status → Ready for Validation
- [ ] Phase 2.7: Hand off to azure-validate
