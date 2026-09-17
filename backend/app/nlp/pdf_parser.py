import os
import io
import logging
from typing import Dict, Any, Tuple
import pdfplumber
from pypdf import PdfReader
from app.nlp.text_cleaner import clean_text

logger = logging.getLogger(__name__)

class PDFParseException(Exception):
    """Custom exception raised when PDF parsing fails or document is unreadable."""
    pass

def extract_text_from_pdf(file_path_or_bytes: str | bytes) -> Tuple[str, int, Dict[str, Any]]:
    """
    Extract text and layout from a PDF file using pdfplumber with fallback to pypdf.
    Validates magic bytes, checks for image-only/scanned documents, and cleans text.
    """
    if isinstance(file_path_or_bytes, str):
        if not os.path.exists(file_path_or_bytes):
            raise PDFParseException(f"PDF file does not exist at {file_path_or_bytes}")
        with open(file_path_or_bytes, "rb") as f:
            pdf_bytes = f.read()
    else:
        pdf_bytes = file_path_or_bytes

    # Validate PDF Magic Bytes (%PDF-)
    if not pdf_bytes.startswith(b"%PDF-"):
        raise PDFParseException("Invalid PDF file: Missing %PDF- header magic bytes.")

    page_count = 0
    extracted_pages = []
    metadata = {}

    # Primary strategy: pdfplumber for layout fidelity
    try:
        with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
            page_count = len(pdf.pages)
            metadata = pdf.metadata or {}
            for idx, page in enumerate(pdf.pages):
                page_text = page.extract_text(layout=True)
                if not page_text or not page_text.strip():
                    page_text = page.extract_text()
                if page_text:
                    extracted_pages.append(page_text)
    except Exception as e:
        logger.warning(f"pdfplumber extraction encountered an issue: {e}. Falling back to pypdf.")
        extracted_pages = []

    # Fallback strategy: pypdf
    if not extracted_pages:
        try:
            reader = PdfReader(io.BytesIO(pdf_bytes))
            page_count = len(reader.pages)
            if reader.metadata:
                metadata = {str(k): str(v) for k, v in reader.metadata.items()}
            for page in reader.pages:
                text = page.extract_text()
                if text:
                    extracted_pages.append(text)
        except Exception as e:
            raise PDFParseException(f"Failed to read PDF structure: {str(e)}")

    full_text = "\n\n".join(extracted_pages)
    cleaned = clean_text(full_text)

    # Validate that extracted text has actual content
    if len(cleaned.strip()) < 40:
        raise PDFParseException(
            "Scanned or image-only PDF detected: Could not extract readable text layers. "
            "Please upload a standard text-based PDF resume."
        )

    return cleaned, page_count, metadata
