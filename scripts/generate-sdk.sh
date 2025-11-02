#!/bin/bash

# Logging function
log() {
    local level=$1
    local message=$2
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$timestamp] [$level] $message" | tee -a ../logs/documentation.log
}

log "INFO" "Starting Vue.js Admin panel SDK generation"

# Record start time
start_time=$(date +%s)

echo "🔄 Generating SDK for Vue.js Admin panel..."
echo ""

# Check if OpenAPI spec exists
OPENAPI_SPEC="../deiex-go/docs/swagger.json"
if [ ! -f "$OPENAPI_SPEC" ]; then
    log "ERROR" "OpenAPI spec not found at: $OPENAPI_SPEC"
    echo "Please ensure the Go backend has generated the OpenAPI spec"
    exit 1
fi

log "INFO" "Found OpenAPI spec at: $OPENAPI_SPEC"

# Remove old generated code
log "INFO" "Removing old generated code..."
if [ -d "src/generated" ]; then
    rm -rf src/generated
    log "INFO" "Removed old generated code"
fi

# Generate new SDK using OpenAPI Generator
log "INFO" "Generating new Vue.js SDK..."
npx @openapitools/openapi-generator-cli generate \
  -i "$OPENAPI_SPEC" \
  -g typescript-axios \
  -o src/generated \
  --additional-properties=withInterfaces=true,useSingleRequestParameter=true,supportsES6=true,npmName=deiex-admin-sdk

if [ $? -eq 0 ]; then
    # Record end time
    end_time=$(date +%s)
    duration=$((end_time - start_time))
    
    log "SUCCESS" "SDK generated successfully (Duration: ${duration}s)"
    log "INFO" "Location: src/generated/"
else
    log "ERROR" "SDK generation failed"
    exit 1
fi

log "INFO" "Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    log "INFO" "Dependencies installed"
else
    log "ERROR" "Failed to install dependencies"
    exit 1
fi

log "INFO" "Vue.js SDK generation complete!"