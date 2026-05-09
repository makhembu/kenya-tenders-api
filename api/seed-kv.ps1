# Seed a test key in the local KV
$apiKey = "test-key-123"
$groupData = @{ id="test-group-001"; name="Kasarani Super Chama" } | ConvertTo-Json -Compress
npx wrangler kv:key put --binding BAKIPAY_KV --local "auth:$apiKey" "$groupData"
Write-Host "Local KV seeded with API key: $apiKey"
