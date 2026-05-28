import os
import shutil
import sqlite3
from werkzeug.security import check_password_hash, generate_password_hash

DB_PATH = os.path.join(os.path.dirname(__file__), "data", "intellecta.db")
LEGACY_DB_PATH = os.path.join(os.path.dirname(__file__), "data", "ai_tutor.db")


def get_conn() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    if os.path.isfile(LEGACY_DB_PATH) and not os.path.isfile(DB_PATH):
        shutil.copy2(LEGACY_DB_PATH, DB_PATH)
    with get_conn() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL COLLATE NOCASE,
                password_hash TEXT NOT NULL,
                name TEXT NOT NULL DEFAULT '',
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
            """
        )
        conn.commit()


def create_user(email: str, password: str, name: str = "") -> dict:
    email = email.strip().lower()
    password_hash = generate_password_hash(password)
    display_name = (name or email.split("@")[0]).strip()

    try:
        with get_conn() as conn:
            cursor = conn.execute(
                "INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)",
                (email, password_hash, display_name),
            )
            conn.commit()
            user_id = cursor.lastrowid
    except sqlite3.IntegrityError:
        raise ValueError("Email already registered")

    return get_user_by_id(user_id)


def get_user_by_email(email: str) -> dict | None:
    email = email.strip().lower()
    with get_conn() as conn:
        row = conn.execute(
            "SELECT id, email, password_hash, name, created_at FROM users WHERE email = ?",
            (email,),
        ).fetchone()
    return dict(row) if row else None


def get_user_by_id(user_id: int) -> dict | None:
    with get_conn() as conn:
        row = conn.execute(
            "SELECT id, email, name, created_at FROM users WHERE id = ?",
            (user_id,),
        ).fetchone()
    return dict(row) if row else None


def verify_user(email: str, password: str) -> dict | None:
    user = get_user_by_email(email)
    if not user:
        return None
    if not check_password_hash(user["password_hash"], password):
        return None
    return {
        "id": user["id"],
        "email": user["email"],
        "name": user["name"],
        "created_at": user["created_at"],
    }
