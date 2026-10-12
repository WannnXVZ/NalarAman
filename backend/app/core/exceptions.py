from fastapi import Request, status
from fastapi.responses import JSONResponse

class ModelUnavailableException(Exception):
    def __init__(self, message: str = "Model klasifikasi belum siap dimuat."):
        self.message = message

class InvalidInputException(Exception):
    def __init__(self, message: str = "Input tidak valid."):
        self.message = message

class OcrFailedException(Exception):
    def __init__(self, message: str = "OCR tidak menemukan teks yang terbaca dalam gambar.", detail: any = None):
        self.message = message
        self.detail = detail

class AppException(Exception):
    def __init__(self, status_code: int = 400, error_code: str = "INTERNAL_ERROR", message: str = "Terjadi kesalahan.", detail: any = None):
        self.status_code = status_code
        self.error_code = error_code
        self.message = message
        self.detail = detail

async def model_unavailable_handler(request: Request, exc: ModelUnavailableException):
    return JSONResponse(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        content={
            "request_status": "error",
            "error_code": "MODEL_UNAVAILABLE",
            "message": exc.message,
            "detail": None
        }
    )

async def invalid_input_handler(request: Request, exc: InvalidInputException):
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={
            "request_status": "error",
            "error_code": "INVALID_INPUT",
            "message": exc.message,
            "detail": None
        }
    )

async def ocr_failed_handler(request: Request, exc: OcrFailedException):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "request_status": "error",
            "error_code": "OCR_FAILED",
            "message": exc.message,
            "detail": exc.detail
        }
    )

async def app_exception_handler(request: Request, exc: AppException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "request_status": "error",
            "error_code": exc.error_code,
            "message": exc.message,
            "detail": exc.detail
        }
    )

