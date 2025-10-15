Quick local server instructions for Windows PowerShell

Why: Service Workers and the web manifest require the app to be served over http(s). If you open `Index.html` directly (file://), you'll see errors like:
- "Service Worker registration failed: The URL protocol of the current origin ('null') is not supported."
- "Access to internal resource at 'file:///.../site.webmanifest' from origin 'null' has been blocked by CORS policy"

Run one of these from the project root (where `Index.html` lives):

Option A: Python 3 (if you have Python installed)
```powershell
# Python 3 - works on most systems
python -m http.server 8000
# Then open in browser: http://localhost:8000/Index.html
```

Option B: Node.js (if you have npm)
```powershell
# Install once
npm install -g http-server
# Run
http-server -p 8000
# Then open: http://localhost:8000/Index.html
```

Option C: Using PowerShell's simple listener (Windows 10+)
```powershell
# Run in project folder
Start-Process powershell -ArgumentList '-NoExit','-Command','Set-Location -Path "'+(Get-Location).Path+'"; python -m http.server 8000'
# Or use this one-liner if python is available
python -m http.server 8000
```

After serving, reload the page and you should no longer see the manifest / service worker CORS errors. If you still see errors, check the browser console and share the output here.
