# Encode web-optimised WebM (+ optional MP4) atmosphere loops for Albion Faeries.
$ErrorActionPreference = "Stop"
$root = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
# Script lives in site/scripts — site root is parent of scripts
$site = Split-Path $PSScriptRoot -Parent
$src = "C:\Documents\OneDrive - Naughty Kiwi\Projects\Radical Faeries\Albion Faeries"

function Encode-Webm([string]$InputPath, [string]$OutputPath, [int]$Crf = 36, [string]$Scale = "1280:-2", [double]$Seconds = 0) {
  $args = @("-y", "-i", $InputPath, "-an", "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "$Crf", "-row-mt", "1", "-deadline", "good", "-cpu-used", "2", "-vf", "scale=${Scale},fps=24")
  if ($Seconds -gt 0) { $args = @("-y", "-i", $InputPath, "-an", "-t", "$Seconds") + $args[4..($args.Length-1)] }
  & ffmpeg @args $OutputPath
}

Write-Host "Encoding fire-bg.webm..."
Encode-Webm "$site\assets\faery-fire\fire-bg.mp4" "$site\assets\faery-fire\fire-bg.webm" 36

Write-Host "Encoding forest-bg.webm from source art..."
Encode-Webm "$src\art\forestbackground.mp4" "$site\assets\deep-glade\forest-bg.webm" 38 "1280:-2" 12

Write-Host "Done."
Get-ChildItem "$site\assets\deep-glade","$site\assets\faery-fire" | Format-Table Name, @{N='KB';E={[math]::Round($_.Length/1KB)}}
