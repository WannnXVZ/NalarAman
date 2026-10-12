import os
import sys
import subprocess
import urllib.request

url = "https://github.com/UB-Mannheim/tesseract/releases/download/v5.4.0.20240606/tesseract-ocr-w64-setup-5.4.0.20240606.exe"
temp_dir = os.environ.get("TEMP", os.path.dirname(__file__))
installer_path = os.path.join(temp_dir, "tesseract-setup.exe")

local_appdata = os.environ.get("LOCALAPPDATA", os.path.expanduser("~"))
target_dir = os.path.join(local_appdata, "Programs", "Tesseract-OCR")

print(f"Downloading Tesseract from {url}...")
if not os.path.exists(installer_path) or os.path.getsize(installer_path) < 1000000:
    urllib.request.urlretrieve(url, installer_path)
    print(f"Downloaded to {installer_path} ({os.path.getsize(installer_path)} bytes)")
else:
    print(f"Found existing installer at {installer_path} ({os.path.getsize(installer_path)} bytes)")

print(f"Installing silently to: {target_dir}...")
# NSIS silent install argument
cmd = f'"{installer_path}" /S /D={target_dir}'
proc = subprocess.run(cmd, shell=True)

tesseract_exe = os.path.join(target_dir, "tesseract.exe")
if os.path.exists(tesseract_exe):
    print(f"SUCCESS: Tesseract executable installed at {tesseract_exe}")
    # Test execution
    ver_proc = subprocess.run([tesseract_exe, "--version"], capture_output=True, text=True)
    print("Version output:", ver_proc.stdout)
else:
    print(f"WARNING: {tesseract_exe} not found yet. Installer return code: {proc.returncode}")
