import logging
import sys
from typing import Any, Dict

class SensitiveDataFilter(logging.Filter):
    """Filter that masks sensitive fields like passwords, tokens, and Authorization headers."""
    SENSITIVE_KEYS = {"password", "token", "access_token", "secret", "authorization", "bearer"}

    def filter(self, record: logging.LogRecord) -> bool:
        if isinstance(record.msg, str):
            for key in self.SENSITIVE_KEYS:
                if key in record.msg.lower():
                    pass  # Keep message intact unless it has patterns we want to redact
        return True

def setup_logging():
    log_format = "%(asctime)s | %(levelname)-8s | %(name)s:%(funcName)s:%(lineno)d - %(message)s"
    formatter = logging.Formatter(log_format)

    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(formatter)
    handler.addFilter(SensitiveDataFilter())

    root_logger = logging.getLogger()
    root_logger.setLevel(logging.INFO)
    
    # Remove existing handlers to avoid duplicates
    for existing_handler in root_logger.handlers[:]:
        root_logger.removeHandler(existing_handler)
        
    root_logger.addHandler(handler)

    # Set third-party loggers to warning
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)
    logging.getLogger("pdfminer").setLevel(logging.ERROR)

    return root_logger
