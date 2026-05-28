import json
import os
import re

from dotenv import load_dotenv
from groq import Groq

load_dotenv()

VISION_MODEL = os.environ.get(
    "GROQ_VISION_MODEL", "meta-llama/llama-4-scout-17b-16e-instruct"
)

ANALYSIS_PROMPT = """You analyze homework or study images for a tutor app that ONLY supports these four subjects:
- Mathematics (MathAgent)
- Physics (PhysicsAgent)
- Chemistry (ChemistryAgent)
- History (HistoryAgent)

Read the image carefully. Extract any question, equation, or problem text visible in the image.

Respond with JSON only (no markdown, no code fences):
{
  "in_scope": true or false,
  "subject": "MathAgent" | "PhysicsAgent" | "ChemistryAgent" | "HistoryAgent" | "Unknown",
  "extracted_question": "full question text from the image",
  "image_summary": "one sentence describing what is in the image",
  "detected_topic": "main topic you see",
  "reason": "short explanation"
}

Rules:
- Set in_scope to false if the question is NOT about math, physics, chemistry, or history (e.g. biology, English, geography, computer science unrelated to these four, art, economics, etc.).
- If the image has no clear academic question, set in_scope to false and explain in reason.
- If in_scope is true, subject must be one of the four agents above (not Unknown).
"""


class ImageVisionService:
    def __init__(self):
        self.client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

    def analyze(
        self, image_base64: str, mime_type: str = "image/jpeg", user_note: str = ""
    ) -> dict:
        cleaned_b64 = self._strip_data_url(image_base64)
        if not cleaned_b64:
            return {
                "in_scope": False,
                "subject": "Unknown",
                "extracted_question": "",
                "image_summary": "No image data received.",
                "detected_topic": "unknown",
                "reason": "Missing image.",
            }

        note = (user_note or "").strip()
        text_part = ANALYSIS_PROMPT
        if note:
            text_part += f"\n\nOptional note from the student: {note}"

        try:
            completion = self.client.chat.completions.create(
                model=VISION_MODEL,
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": text_part},
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:{mime_type};base64,{cleaned_b64}",
                                },
                            },
                        ],
                    }
                ],
                temperature=0.1,
            )
            raw = completion.choices[0].message.content or ""
            return self._parse_analysis_response(raw)
        except Exception as e:
            return {
                "in_scope": False,
                "subject": "Unknown",
                "extracted_question": "",
                "image_summary": "Could not analyze the image.",
                "detected_topic": "unknown",
                "reason": str(e),
            }

    @staticmethod
    def _strip_data_url(value: str) -> str:
        if not value:
            return ""
        if "," in value and value.startswith("data:"):
            return value.split(",", 1)[1]
        return value.strip()

    def _parse_analysis_response(self, raw_response: str) -> dict:
        if not raw_response:
            return {
                "in_scope": False,
                "subject": "Unknown",
                "extracted_question": "",
                "image_summary": "Empty vision response.",
                "detected_topic": "unknown",
                "reason": "Empty vision response.",
            }

        cleaned = raw_response.strip()
        if cleaned.startswith("```"):
            cleaned = cleaned.strip("`").strip()
            if cleaned.startswith("json"):
                cleaned = cleaned[4:].strip()

        try:
            data = json.loads(cleaned)
            if isinstance(data, dict):
                return self._normalize_analysis(data)
        except json.JSONDecodeError:
            pass

        match = re.search(r"\{[\s\S]*\}", cleaned)
        if match:
            try:
                data = json.loads(match.group(0))
                if isinstance(data, dict):
                    return self._normalize_analysis(data)
            except json.JSONDecodeError:
                pass

        return {
            "in_scope": False,
            "subject": "Unknown",
            "extracted_question": "",
            "image_summary": cleaned[:200],
            "detected_topic": "unknown",
            "reason": "Could not parse vision model JSON.",
        }

    @staticmethod
    def _normalize_analysis(data: dict) -> dict:
        subject = data.get("subject", "Unknown")
        valid = {
            "MathAgent",
            "PhysicsAgent",
            "ChemistryAgent",
            "HistoryAgent",
            "Unknown",
        }
        if subject not in valid:
            subject = "Unknown"

        in_scope = bool(data.get("in_scope", False))
        if in_scope and subject == "Unknown":
            in_scope = False

        return {
            "in_scope": in_scope,
            "subject": subject,
            "extracted_question": str(data.get("extracted_question", "")).strip(),
            "image_summary": str(data.get("image_summary", "")).strip(),
            "detected_topic": str(data.get("detected_topic", "")).strip(),
            "reason": str(data.get("reason", "")).strip(),
        }
