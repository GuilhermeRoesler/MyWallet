Add-Type -AssemblyName System.Drawing

$publicDir = "c:\Users\Gui\Desktop\Projetos\repo update\My-Wallet\public"
$srcPath = "C:\Users\Gui\.cursor\projects\c-Users-Gui-Desktop-Projetos-repo-update-My-Wallet\assets\my-wallet-icon-transparent.png"
$iconPath = Join-Path $publicDir "icon.png"

$src = [System.Drawing.Bitmap]::FromFile($srcPath)
$width = $src.Width
$height = $src.Height

$out = New-Object System.Drawing.Bitmap $width, $height, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$gfx = [System.Drawing.Graphics]::FromImage($out)
$gfx.DrawImage($src, 0, 0, $width, $height)
$gfx.Dispose()
$src.Dispose()

function Test-CanvasBackground([byte]$b, [byte]$g, [byte]$r, [byte]$a) {
  if ($a -lt 8) { return $true }
  $max = [Math]::Max($r, [Math]::Max($g, $b))
  $min = [Math]::Min($r, [Math]::Min($g, $b))
  $luma = 0.2126 * $r + 0.7152 * $g + 0.0722 * $b
  $sat = if ($max -eq 0) { 0.0 } else { ($max - $min) / [double]$max }

  # gray/white canvas (including AA fringe into blue)
  if ($luma -ge 185 -and $sat -le 0.18) { return $true }
  if ($min -ge 200) { return $true }
  if ($r -ge 170 -and $g -ge 170 -and $b -ge 170 -and $sat -le 0.25) { return $true }
  # light washed blue fringe (blue blended with white canvas)
  if ($r -ge 150 -and $g -ge 180 -and $b -ge 210 -and $luma -ge 175) { return $true }
  return $false
}

$rect = New-Object System.Drawing.Rectangle 0, 0, $width, $height
$bd = $out.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadWrite, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$stride = $bd.Stride
$bytes = New-Object byte[] ($stride * $height)
[System.Runtime.InteropServices.Marshal]::Copy($bd.Scan0, $bytes, 0, $bytes.Length)

$visited = New-Object bool[] ($width * $height)
$qx = New-Object int[] ($width * $height)
$qy = New-Object int[] ($width * $height)
$head = 0
$tail = 0

function TryEnq([int]$x, [int]$y) {
  if ($x -lt 0 -or $y -lt 0 -or $x -ge $script:width -or $y -ge $script:height) { return }
  $vi = $y * $script:width + $x
  if ($script:visited[$vi]) { return }
  $script:visited[$vi] = $true
  $script:qx[$script:tail] = $x
  $script:qy[$script:tail] = $y
  $script:tail++
}

for ($x = 0; $x -lt $width; $x++) { TryEnq $x 0; TryEnq $x ($height - 1) }
for ($y = 0; $y -lt $height; $y++) { TryEnq 0 $y; TryEnq ($width - 1) $y }

$cleared = 0
while ($head -lt $tail) {
  $x = $qx[$head]
  $y = $qy[$head]
  $head++
  $idx = ($y * $stride) + ($x * 4)
  $b = $bytes[$idx]
  $g = $bytes[$idx + 1]
  $r = $bytes[$idx + 2]
  $a = $bytes[$idx + 3]

  if (Test-CanvasBackground $b $g $r $a) {
    if ($a -ne 0 -or $r -ne 0 -or $g -ne 0 -or $b -ne 0) {
      $bytes[$idx] = 0
      $bytes[$idx + 1] = 0
      $bytes[$idx + 2] = 0
      $bytes[$idx + 3] = 0
      $cleared++
    }
    TryEnq ($x + 1) $y
    TryEnq ($x - 1) $y
    TryEnq $x ($y + 1)
    TryEnq $x ($y - 1)
  }
}

[System.Runtime.InteropServices.Marshal]::Copy($bytes, 0, $bd.Scan0, $bytes.Length)
$out.UnlockBits($bd)
Write-Host "Flood-cleared canvas pixels: $cleared"

# Measure opaque bounds
$minX = $width; $minY = $height; $maxX = -1; $maxY = -1
for ($y = 0; $y -lt $height; $y++) {
  for ($x = 0; $x -lt $width; $x++) {
    if ($out.GetPixel($x, $y).A -gt 16) {
      if ($x -lt $minX) { $minX = $x }
      if ($y -lt $minY) { $minY = $y }
      if ($x -gt $maxX) { $maxX = $x }
      if ($y -gt $maxY) { $maxY = $y }
    }
  }
}
Write-Host "Opaque bounds: ($minX,$minY)-($maxX,$maxY)"

# Fit radius from top row of content
$firstTop = $minX
for ($x = $minX; $x -le $maxX; $x++) {
  if ($out.GetPixel($x, $minY).A -gt 16) { $firstTop = $x; break }
}
$measuredR = $firstTop - $minX
Write-Host "Measured corner radius: $measuredR"

# Hard mask with measured radius (+ small safety) using LockBits
$cornerRadius = [Math]::Max(8, $measuredR + 2)
$bd = $out.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadWrite, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
[System.Runtime.InteropServices.Marshal]::Copy($bd.Scan0, $bytes, 0, $bytes.Length)
$maskCleared = 0
for ($y = 0; $y -lt $height; $y++) {
  for ($x = 0; $x -lt $width; $x++) {
    $idx = ($y * $stride) + ($x * 4)
    if ($bytes[$idx + 3] -eq 0) { continue }

    if ($x -lt $minX -or $x -gt $maxX -or $y -lt $minY -or $y -gt $maxY) {
      $bytes[$idx] = 0; $bytes[$idx + 1] = 0; $bytes[$idx + 2] = 0; $bytes[$idx + 3] = 0
      $maskCleared++; continue
    }

    $cx = $null; $cy = $null
    if ($x -lt ($minX + $cornerRadius) -and $y -lt ($minY + $cornerRadius)) {
      $cx = $minX + $cornerRadius; $cy = $minY + $cornerRadius
    }
    elseif ($x -gt ($maxX - $cornerRadius) -and $y -lt ($minY + $cornerRadius)) {
      $cx = $maxX - $cornerRadius; $cy = $minY + $cornerRadius
    }
    elseif ($x -lt ($minX + $cornerRadius) -and $y -gt ($maxY - $cornerRadius)) {
      $cx = $minX + $cornerRadius; $cy = $maxY - $cornerRadius
    }
    elseif ($x -gt ($maxX - $cornerRadius) -and $y -gt ($maxY - $cornerRadius)) {
      $cx = $maxX - $cornerRadius; $cy = $maxY - $cornerRadius
    }
    if ($null -eq $cx) { continue }

    $dist = [Math]::Sqrt(($x - $cx) * ($x - $cx) + ($y - $cy) * ($y - $cy))
    if ($dist -gt $cornerRadius) {
      $bytes[$idx] = 0; $bytes[$idx + 1] = 0; $bytes[$idx + 2] = 0; $bytes[$idx + 3] = 0
      $maskCleared++
    }
    elseif ($dist -gt ($cornerRadius - 2.0)) {
      $t = ($cornerRadius - $dist) / 2.0
      $na = [byte]([int][Math]::Round($bytes[$idx + 3] * $t))
      $bytes[$idx + 3] = $na
    }
  }
}
[System.Runtime.InteropServices.Marshal]::Copy($bytes, 0, $bd.Scan0, $bytes.Length)
$out.UnlockBits($bd)
Write-Host "Mask cleared: $maskCleared with cornerRadius=$cornerRadius"

# Verify
foreach ($pt in @(@(0,0), @(40,40), @(80,80), @([int](($minX+$maxX)/2), $minY), @(512,512), @(1023,1023))) {
  $c = $out.GetPixel($pt[0], $pt[1])
  Write-Host ("({0},{1}) A={2} {3},{4},{5}" -f $pt[0], $pt[1], $c.A, $c.R, $c.G, $c.B)
}

# Optional: crop to content and re-center on transparent 1024 canvas for full-bleed look
$contentW = $maxX - $minX + 1
$contentH = $maxY - $minY + 1
$final = New-Object System.Drawing.Bitmap 1024, 1024, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$gfx2 = [System.Drawing.Graphics]::FromImage($final)
$gfx2.Clear([System.Drawing.Color]::Transparent)
$gfx2.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$gfx2.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
# scale content to fill ~100% of canvas (slight inset 0)
$scale = [Math]::Min(1024.0 / $contentW, 1024.0 / $contentH)
$dw = [int][Math]::Round($contentW * $scale)
$dh = [int][Math]::Round($contentH * $scale)
$dx = [int]((1024 - $dw) / 2)
$dy = [int]((1024 - $dh) / 2)
$srcRect = New-Object System.Drawing.Rectangle $minX, $minY, $contentW, $contentH
$dstRect = New-Object System.Drawing.Rectangle $dx, $dy, $dw, $dh
$gfx2.DrawImage($out, $dstRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
$gfx2.Dispose()
$out.Dispose()

$final.Save($iconPath, [System.Drawing.Imaging.ImageFormat]::Png)
Write-Host ("Final placed at ({0},{1}) size {2}x{3}" -f $dx, $dy, $dw, $dh)

foreach ($pt in @(@(0,0), @(50,50), @(100,100), @(512,0), @(512,512))) {
  $c = $final.GetPixel($pt[0], $pt[1])
  Write-Host ("final ({0},{1}) A={2} {3},{4},{5}" -f $pt[0], $pt[1], $c.A, $c.R, $c.G, $c.B)
}

function Save-PngBytes([System.Drawing.Bitmap]$bmp) {
  $ms = New-Object System.IO.MemoryStream
  $bmp.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
  return $ms.ToArray()
}
function Resize-Bitmap([System.Drawing.Bitmap]$srcImg, [int]$size) {
  $dest = New-Object System.Drawing.Bitmap $size, $size, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $gr = [System.Drawing.Graphics]::FromImage($dest)
  $gr.Clear([System.Drawing.Color]::Transparent)
  $gr.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceOver
  $gr.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $gr.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $gr.DrawImage($srcImg, 0, 0, $size, $size)
  $gr.Dispose()
  return $dest
}

$scaled = Resize-Bitmap $final 512
$b64 = [Convert]::ToBase64String((Save-PngBytes $scaled))
$scaled.Dispose()
$svg = @"
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <image width="512" height="512" preserveAspectRatio="xMidYMid meet" href="data:image/png;base64,$b64"/>
</svg>
"@
[System.IO.File]::WriteAllText((Join-Path $publicDir "favicon.svg"), ($svg.Trim() + "`n"), [System.Text.UTF8Encoding]::new($false))

$images = @()
foreach ($size in @(16, 32, 48, 64, 128, 256)) {
  $b = Resize-Bitmap $final $size
  $images += ,@($size, (Save-PngBytes $b))
  $b.Dispose()
}
$final.Dispose()

$count = $images.Count
$offset = 6 + (16 * $count)
$ms = New-Object System.IO.MemoryStream
$bw = New-Object System.IO.BinaryWriter $ms
$bw.Write([uint16]0); $bw.Write([uint16]1); $bw.Write([uint16]$count)
$pending = @()
foreach ($img in $images) {
  $size = [int]$img[0]
  $png = [byte[]]$img[1]
  $wb = if ($size -ge 256) { [byte]0 } else { [byte]$size }
  $bw.Write($wb); $bw.Write($wb)
  $bw.Write([byte]0); $bw.Write([byte]0)
  $bw.Write([uint16]1); $bw.Write([uint16]32)
  $bw.Write([uint32]$png.Length); $bw.Write([uint32]$offset)
  $pending += , $png
  $offset += $png.Length
}
foreach ($png in $pending) { $bw.Write([byte[]]$png) }
$bw.Flush()
[System.IO.File]::WriteAllBytes((Join-Path $publicDir "favicon.ico"), $ms.ToArray())
$bw.Dispose(); $ms.Dispose()

Get-ChildItem (Join-Path $publicDir "icon.png"), (Join-Path $publicDir "favicon.svg"), (Join-Path $publicDir "favicon.ico") |
  Format-Table Name, Length
Write-Host Done
