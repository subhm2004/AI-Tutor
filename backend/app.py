from flask import Flask, jsonify, request
from dotenv import load_dotenv
from agents.tutor_agent import TutorAgent
from auth.decorators import jwt_required
from auth.routes import auth_bp
from database import init_db
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
CORS(
    app,
    resources={r"/*": {"origins": "*"}},
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization"],
)
app.register_blueprint(auth_bp)

init_db()
tutor_agent = TutorAgent()


@app.route("/", methods=["GET"])
def hello():
    return {"message": "hello world"}


@app.route("/api/chat", methods=["POST"])
@jwt_required
def chat():
    try:
        data = request.get_json()
        messages = data.get("messages", [])

        if not messages:
            return jsonify({"error": "Missing messages"}), 400

        response = tutor_agent.route(messages)
        return jsonify(response)

    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500


@app.route("/api/chat/image", methods=["POST"])
@jwt_required
def chat_image():
    try:
        data = request.get_json() or {}
        image = data.get("image", "")
        mime_type = data.get("mimeType", "image/jpeg")
        user_note = data.get("text", "")

        if not image:
            return jsonify({"error": "Missing image data"}), 400

        response = tutor_agent.route_image(image, mime_type, user_note)
        return jsonify(response)

    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "message": "IntellectA is healthy."}), 200


@app.route("/api/agents", methods=["GET"])
def agent_status():
    return jsonify({
        "available_agents": [
            "TutorAgent",
            "MathAgent",
            "PhysicsAgent",
            "ChemistryAgent",
            "HistoryAgent",
        ],
        "status": "all agents loaded",
    })


if __name__ == "__main__":
    app.run(debug=True)
