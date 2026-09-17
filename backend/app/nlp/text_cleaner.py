import re
import unicodedata

def clean_text(text: str) -> str:
    """Normalize unicode, whitespace, and clean artifacts from extracted PDF text."""
    if not text:
        return ""

    # Normalize unicode (decompose ligatures like 'fi', 'fl', smart quotes)
    text = unicodedata.normalize("NFKD", text)

    # Standardize common typographic quotes and dashes
    text = text.replace("“", '"').replace("”", '"').replace("’", "'").replace("‘", "'")
    text = text.replace("–", "-").replace("—", "-")

    # Standardize bullet points
    text = re.sub(r"[\u2022\u2023\u25E6\u2043\u2219\uf0b7\uf0a7]", "\n• ", text)

    # Replace consecutive spaces and tabs with single space
    text = re.sub(r"[ \t]+", " ", text)

    # Replace 3 or more newlines with 2 newlines
    text = re.sub(r"\n\s*\n\s*\n+", "\n\n", text)

    return text.strip()

def extract_bullets(text: str) -> list[str]:
    """Extract individual bullet points from a section text."""
    lines = text.split("\n")
    bullets = []
    current_bullet = []

    for line in lines:
        stripped = line.strip()
        if not stripped:
            continue

        is_new_bullet = False
        if stripped.startswith("•") or stripped.startswith("-") or stripped.startswith("*"):
            is_new_bullet = True
            stripped = stripped.lstrip("•-* ").strip()
        elif re.match(r"^\d+[\.\)]\s+", stripped):
            is_new_bullet = True
            stripped = re.sub(r"^\d+[\.\)]\s+", "", stripped)

        if is_new_bullet:
            if current_bullet:
                bullets.append(" ".join(current_bullet).strip())
                current_bullet = []
            current_bullet.append(stripped)
        else:
            if current_bullet:
                current_bullet.append(stripped)
            else:
                bullets.append(stripped)

    if current_bullet:
        bullets.append(" ".join(current_bullet).strip())

    return [b for b in bullets if len(b) > 5]
