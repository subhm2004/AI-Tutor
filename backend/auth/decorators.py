from functools import wraps

from flask import g, jsonify, request

from auth.jwt_utils import decode_access_token


def jwt_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return jsonify({"error": "Authorization token required"}), 401

        token = auth_header.split(" ", 1)[1].strip()
        payload = decode_access_token(token)
        if not payload:
            return jsonify({"error": "Invalid or expired token"}), 401

        g.user_id = int(payload.get("sub", 0))
        g.user_email = payload.get("email", "")
        return f(*args, **kwargs)

    return decorated
