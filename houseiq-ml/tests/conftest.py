import os
import sys
from pathlib import Path
import pytest
from fastapi.testclient import TestClient

# Ensure the package root (houseiq-ml directory) is importable when running from repo root
_this_dir = Path(__file__).resolve().parent
_project_root = _this_dir.parent
if str(_project_root) not in sys.path:
    sys.path.insert(0, str(_project_root))

# Import app only after sys.path has been adjusted
from main import app


@pytest.fixture(scope="module")
def client():
    with TestClient(app) as c:
        yield c

