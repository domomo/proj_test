"""Expose the backend application when commands run from the repository root.

Keep one implementation under backend/app so root commands, backend-only
deployments, and Alembic all import the same app.* modules.
"""
from pathlib import Path

__path__.append(str(Path(__file__).resolve().parent.parent / 'backend' / 'app'))
