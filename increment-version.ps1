# PowerShell script to increment version in build.gradle

$buildGradlePath = "android\app\build.gradle"

# Read the file
$content = Get-Content $buildGradlePath -Raw

# Extract current versionCode
if ($content -match 'versionCode\s+(\d+)') {
    $currentVersionCode = [int]$matches[1]
    $newVersionCode = $currentVersionCode + 1
    Write-Host "Incrementing versionCode: $currentVersionCode -> $newVersionCode"
    $content = $content -replace "versionCode\s+\d+", "versionCode $newVersionCode"
}

# Extract current versionName
if ($content -match 'versionName\s+"([^"]+)"') {
    $currentVersionName = $matches[1]

    # Parse version (e.g., "1.0" or "1.0.1")
    $versionParts = $currentVersionName.Split('.')

    if ($versionParts.Length -eq 2) {
        # Format: "1.0" -> "1.0.1"
        $newVersionName = "$($versionParts[0]).$($versionParts[1]).1"
    } else {
        # Format: "1.0.1" -> "1.0.2"
        $patch = [int]$versionParts[2] + 1
        $newVersionName = "$($versionParts[0]).$($versionParts[1]).$patch"
    }

    Write-Host "Incrementing versionName: $currentVersionName -> $newVersionName"
    $content = $content -replace "versionName\s+`"[^`"]+`"", "versionName `"$newVersionName`""
}

# Write back to file
Set-Content -Path $buildGradlePath -Value $content -NoNewline

Write-Host ""
Write-Host "Version updated successfully!" -ForegroundColor Green
Write-Host "  versionCode: $newVersionCode" -ForegroundColor Cyan
Write-Host "  versionName: $newVersionName" -ForegroundColor Cyan
