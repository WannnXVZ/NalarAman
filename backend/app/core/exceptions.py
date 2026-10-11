from fastapi import Request, status
from fastapi.responses import JSONResponse

class ModelUnavailableException(Exception):
    def __init__(self, message: str = "Model klasifikasi belum siap dimuat."):
        self.message = message

class InvalidInputException(Exception):
    def __init__(self, message: str = "Input tidak valid."):
        self.message = message

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
