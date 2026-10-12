import os
import subprocess

installer = r"C:\Users\ASUS TUF\AppData\Local\Temp\WinGet\UB-Mannheim.TesseractOCR.5.4.0.20240606\tesseract-ocr-w64-setup-5.4.0.20240606.exe"
local_appdata = os.environ.get("LOCALAPPDATA", r"C:\Users\ASUS TUF\AppData\Local")
target_dir = os.path.join(local_appdata, "Programs", "Tesseract-OCR")

print(f"Installer: {installer} (exists: {os.path.exists(installer)})")
print(f"Target: {target_dir}")

cmd = f'"{installer}" /S /D={target_dir}'
print(f"Executing: {cmd}")
res = subprocess.run(cmd, shell=True)
print(f"Result code: {res.returncode}")

exe_path = os.path.join(target_dir, "tesseract.exe")
print(f"tesseract.exe exists: {os.path.exists(exe_path)}")
if os.path.exists(exe_path):
    out = subprocess.run([exe_path, "--version"], capture_output=True, text=True)
    print("Version:\n", out.stdout)
