Write-Host '=== RUBAN Automation Stack Check ==='
Write-Host "Node: $(node -v)"
Write-Host "Python: $(python --version)"
try { ollama --version } catch { Write-Host 'Ollama: not available' }
try { n8n --version } catch { Write-Host 'n8n: not installed or not on PATH yet' }
try { git --version } catch { Write-Host 'git: not available' }
Write-Host '===================================='
