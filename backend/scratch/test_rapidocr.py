from rapidocr_onnxruntime import RapidOCR
from PIL import Image
import numpy as np

img_path = 'backend/data/sample_images/sample_chat_scam.png'
engine = RapidOCR()
img = Image.open(img_path)
ocr_res, elapse = engine(np.array(img))
print("Raw OCR result:")
for item in ocr_res:
    print(item[1], " | Conf:", item[2])
