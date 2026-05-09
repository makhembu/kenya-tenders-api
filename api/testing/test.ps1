$baseUrl = "https://bakipay-api.shelflix.workers.dev"
$validKey = "test-key-123"

function Get-Headers($auth = $true, $idemp = $null) {
    $h = @{ "Content-Type" = "application/json" }
    if ($auth) { $h["Authorization"] = "Bearer $validKey" }
    if ($idemp) { $h["Idempotency-Key"] = $idemp }
    return $h
}

Write-Host "--- BLOCK 1-3: Setup & Core ---"
$member = Invoke-RestMethod -Uri "$baseUrl/v1/members" -Method Post -Headers (Get-Headers) -Body (@{ name="Test Person"; phone="254711111111"; join_date="2024-01-01" } | ConvertTo-Json)
$mid = $member.data.id
Write-Host "Member Created: $mid"

Write-Host "--- BLOCK 4: Contributions ---"
$c1 = Invoke-RestMethod -Uri "$baseUrl/v1/contributions" -Method Post -Headers (Get-Headers) -Body (@{ member_id=$mid; amount=2000; date="2024-01-15"; transaction_id="MPESA"+([guid]::NewGuid().ToString().Substring(0,8)) } | ConvertTo-Json)
$c2 = Invoke-RestMethod -Uri "$baseUrl/v1/contributions" -Method Post -Headers (Get-Headers) -Body (@{ member_id=$mid; amount=2000; date="2024-02-15"; transaction_id="MPESA"+([guid]::NewGuid().ToString().Substring(0,8)) } | ConvertTo-Json)
Write-Host "Contributions Logged"

Write-Host "--- BLOCK 5: Payouts ---"
$calc = Invoke-RestMethod -Uri "$baseUrl/v1/payouts/calculate" -Method Post -Headers (Get-Headers) -Body (@{ total_surplus=10000; basis="contribution_tenure" } | ConvertTo-Json)
$cid = $calc.data.calculation_id

# Find our member in the results
$myShare = $calc.data.data | Where-Object { $_.member_id -eq $mid }
Write-Host "Calculation Created: $cid (Our Member's Share: $($myShare.amount))"

if ($myShare.amount -gt 0) { Write-Host "T19/20: PASS" }

$exec = Invoke-RestMethod -Uri "$baseUrl/v1/payouts/execute" -Method Post -Headers (Get-Headers) -Body (@{ calculation_id=$cid } | ConvertTo-Json)
if ($exec.data.payout_id) { Write-Host "T22/23: PASS" }

Write-Host "--- BLOCK 6: Webhooks ---"
$wh = Invoke-RestMethod -Uri "$baseUrl/v1/webhooks" -Method Post -Headers (Get-Headers) -Body (@{ url="https://example.com/callback"; event_type="payout.completed" } | ConvertTo-Json)
if ($wh.data.id) { Write-Host "T24: PASS" }
