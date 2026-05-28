import re

from flask import Blueprint, g, jsonify, request

from auth.decorators import jwt_required
from auth.jwt_utils import create_access_token
from database import create_user, get_user_by_id, verify_user

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

EMAIL_PATTERN = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def _validate_email(email: str) -> str | None:
    if not email or not EMAIL_PATTERN.match(email.strip()):
        return "Valid email is required"
    return None


def _validate_password(password: str) -> str | None:
    if not password or len(password) < 6:
        return "Password must be at least 6 characters"
    return None


def _user_response(user: dict, token: str | None = None) -> dict:
    body = {
        "user": {
            "id": user["id"],
            "email": user["email"],
            "name": user["name"],
        }
    }
    if token:
        body["token"] = token
    return body


@auth_bp.post("/register")
def register():
    data = request.get_json() or {}
    email = str(data.get("email", "")).strip()
    password = str(data.get("password", ""))
    name = str(data.get("name", "")).strip()

    email_error = _validate_email(email)
    if email_error:
        return jsonify({"error": email_error}), 400

    password_error = _validate_password(password)
    if password_error:
        return jsonify({"error": password_error}), 400

    try:
        user = create_user(email, password, name)
    except ValueError as e:
        return jsonify({"error": str(e)}), 409

    token = create_access_token(user["id"], user["email"])
    return jsonify(_user_response(user, token)), 201


@auth_bp.post("/login")
def login():
    data = request.get_json() or {}
    email = str(data.get("email", "")).strip()
    password = str(data.get("password", ""))

    email_error = _validate_email(email)
    if email_error:
        return jsonify({"error": email_error}), 400

    if not password:
        return jsonify({"error": "Password is required"}), 400

    user = verify_user(email, password)
    if not user:
        return jsonify({"error": "Invalid email or password"}), 401

    token = create_access_token(user["id"], user["email"])
    return jsonify(_user_response(user, token)), 200


@auth_bp.get("/me")
@jwt_required
def me():
    user = get_user_by_id(g.user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(_user_response(user)), 200
