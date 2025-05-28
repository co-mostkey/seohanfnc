# Seohan F&C Website Endpoint Testing Script
Write-Host "=== Seohan F&C Website Endpoint Test ===" -ForegroundColor Green
Write-Host ""

$baseUrl = "http://localhost:3000"
$testResults = @()

# Test endpoints
$endpoints = @(
    @{ Name = "Homepage"; Path = "/" },
    @{ Name = "Products"; Path = "/products/" },
    @{ Name = "About"; Path = "/about/" },
    @{ Name = "Support"; Path = "/support/" },
    @{ Name = "Admin Main"; Path = "/admin/" },
    @{ Name = "Admin Products"; Path = "/admin/products/" },
    @{ Name = "Admin Inquiries"; Path = "/admin/inquiries/" },
    @{ Name = "Intranet Main"; Path = "/intranet/" },
    @{ Name = "Intranet Employees"; Path = "/intranet/employees/" },
    @{ Name = "Intranet Documents"; Path = "/intranet/documents/" },
    @{ Name = "Health Check API"; Path = "/api/health/" }
)

foreach ($endpoint in $endpoints) {
    try {
        Write-Host "Testing: $($endpoint.Name)" -NoNewline
        
        $url = "$baseUrl$($endpoint.Path)"
        $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 10
        
        if ($response.StatusCode -eq 200) {
            Write-Host " ✅ SUCCESS (200)" -ForegroundColor Green
            $testResults += [PSCustomObject]@{
                Endpoint   = $endpoint.Name
                URL        = $endpoint.Path
                Status     = "✅ SUCCESS"
                StatusCode = 200
                Size       = "$([math]::Round($response.Content.Length / 1024, 1)) KB"
            }
        }
        else {
            Write-Host " ⚠️  WARNING ($($response.StatusCode))" -ForegroundColor Yellow
            $testResults += [PSCustomObject]@{
                Endpoint   = $endpoint.Name
                URL        = $endpoint.Path
                Status     = "⚠️ WARNING"
                StatusCode = $response.StatusCode
                Size       = "N/A"
            }
        }
    }
    catch {
        Write-Host " ❌ FAILED" -ForegroundColor Red
        $testResults += [PSCustomObject]@{
            Endpoint   = $endpoint.Name
            URL        = $endpoint.Path
            Status     = "❌ FAILED"
            StatusCode = "Error"
            Size       = $_.Exception.Message
        }
    }
}

Write-Host ""
Write-Host "=== Test Results Summary ===" -ForegroundColor Cyan
$testResults | Format-Table -AutoSize

$successCount = ($testResults | Where-Object { $_.Status -eq "✅ SUCCESS" }).Count
$totalCount = $testResults.Count

Write-Host ""
Write-Host "Total Tests: $totalCount" -ForegroundColor White
Write-Host "Success: $successCount" -ForegroundColor Green
Write-Host "Failed: $($totalCount - $successCount)" -ForegroundColor Red
Write-Host ""

if ($successCount -eq $totalCount) {
    Write-Host "🎉 All tests passed! Website is working correctly." -ForegroundColor Green
}
else {
    Write-Host "⚠️  Some pages have issues. Please check the logs." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "To test manually in browser, visit these URLs:" -ForegroundColor Cyan
Write-Host "• Homepage: http://localhost:3000/" -ForegroundColor White
Write-Host "• Admin Panel: http://localhost:3000/admin/" -ForegroundColor White
Write-Host "• Intranet: http://localhost:3000/intranet/" -ForegroundColor White 