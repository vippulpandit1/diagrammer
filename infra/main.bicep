targetScope = 'subscription'

// ── Parameters ────────────────────────────────────────────────────────────────
@minLength(1)
@maxLength(64)
@description('Name of the environment (e.g. dev, staging, prod).')
param environmentName string

@description('Primary Azure region for all resources.')
param location string = 'westus2'

// ── Variables ─────────────────────────────────────────────────────────────────
var resourceGroupName = 'rg-${environmentName}-rjsdraw'
var staticWebAppName  = 'swa-${environmentName}-rjsdraw'

var tags = {
  'azd-env-name': environmentName
  project: 'r-js-draw'
}

// ── Resource Group ────────────────────────────────────────────────────────────
resource rg 'Microsoft.Resources/resourceGroups@2022-09-01' = {
  name: resourceGroupName
  location: location
  tags: tags
}

// ── Static Web App ────────────────────────────────────────────────────────────
module staticWebApp 'modules/staticwebapp.bicep' = {
  name: 'staticWebAppDeploy'
  scope: rg
  params: {
    name: staticWebAppName
    location: location
    tags: tags
    skuName: 'Free'
    appLocation: '/'
    outputLocation: 'dist'
    appBuildCommand: 'npm run build'
  }
}

// ── Outputs ───────────────────────────────────────────────────────────────────
output AZURE_LOCATION string = location
output AZURE_RESOURCE_GROUP string = rg.name
output SERVICE_WEB_ENDPOINT string = staticWebApp.outputs.defaultHostname
