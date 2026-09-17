import pytest
from app.nlp.pdf_parser import extract_text_from_pdf, PDFParseException
from tests.conftest import generate_pdf_bytes

def test_extract_valid_pdf():
    pdf_bytes = generate_pdf_bytes(
        full_name="Jordan Bell",
        skills=["Python", "FastAPI", "Docker", "SQL"],
        experiences=[
            "Senior Backend Engineer at CloudTech (2021 - Present)",
            "• Built microservices with Python and FastAPI."
        ]
    )
    text, pages, metadata = extract_text_from_pdf(pdf_bytes)
    assert pages >= 1
    assert "Jordan Bell" in text
    assert "FastAPI" in text
    assert "Python" in text

def test_reject_invalid_magic_bytes():
    fake_bytes = b"This is not a PDF document at all"
    with pytest.raises(PDFParseException) as exc_info:
        extract_text_from_pdf(fake_bytes)
    assert "Missing %PDF- header magic bytes" in str(exc_info.value)

def test_reject_empty_or_scanned_pdf():
    # PDF with blank content
    import io
    from reportlab.platypus import SimpleDocTemplate, Spacer
    from reportlab.lib.pagesizes import letter

    buf = io.BytesIO()
    doc = SimpleDocTemplate(buf, pagesize=letter)
    doc.build([Spacer(1, 100)])
    buf.seek(0)
    blank_pdf = buf.getvalue()

    with pytest.raises(PDFParseException) as exc_info:
        extract_text_from_pdf(blank_pdf)
    assert "Scanned or image-only PDF detected" in str(exc_info.value)
