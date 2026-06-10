// ── Parameters ────────────────────────────────────────────────────────────────
@description('Name for the Static Web App resource.')
param name string

@description('Azure region.')
param location string

@description('Resource tags.')
param tags object = {}

@description('SKU: Free or Standard.')
@allowed(['Free', 'Standard'])
param skuName string = 'Free'

@description('Root of the application source code.')
param appLocation string = '/'

@description('Folder where the build output is placed.')
param outputLocation string = 'dist'

@description('Command to build the frontend application.')
param appBuildCommand string = 'npm run build'

// ── Resource ──────────────────────────────────────────────────────────────────
resource staticWebApp 'Microsoft.Web/staticSites@2023-01-01' = {
  name: name
  location: location
  tags: tags
  sku: {
    name: skuName
    tier: skuName
  }
  properties: {
    buildProperties: {
      appLocation: appLocation
      outputLocation: outputLocation
      appBuildCommand: appBuildCommand
    }
    // No repository URL — azd pushes the built dist/ folder directly
  }
}

// ── Outputs ───────────────────────────────────────────────────────────────────
output id string = staticWebApp.id
output name string = staticWebApp.name
output defaultHostname string = staticWebApp.properties.defaultHostname
