from pydantic import BaseModel, Field

class AnalyzeRequest(BaseModel):
    text: str = Field(
        ...,
        min_length=5,
        max_length=2000,
        description="Teks pesan digital yang akan dianalisis untuk deteksi penipuan"
    )
