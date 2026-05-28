from .math_agent import MathAgent
from .physics_agent import PhysicsAgent
from .chemistry_agent import ChemistryAgent
from .history_agent import HistoryAgent
from .base_agent import BaseAgent
from services.image_vision import ImageVisionService
import json
import re

# MAX_TOKENS_APPROX = 5000 * 4  # ~4 chars per token (safe estimate)
MAX_MESSAGES = 10

class TutorAgent(BaseAgent):
    def __init__(self):
        super().__init__("TutorAgent", """
            You are a subject classifier for a multi-agent tutor system. Given a student query, your job is to identify the appropriate subject agent that should handle it.

            Available agents:
            - MathAgent: Arithmetic, algebra, calculus, equations, statistics.
            - PhysicsAgent: Force, motion, energy, mass, velocity, Newton's laws.
            - ChemistryAgent: Atoms, molecules, reactions, periodic table, acids and bases.
            - HistoryAgent: Historical events, timelines, famous leaders, ancient civilizations.

            Respond in the following JSON format:
            {
                "subject": "MathAgent" | "PhysicsAgent" | ChemistryAgent | HistoryAgent | "Unknown",
                "reason": "<short explanation>"
            }
        """)
        self.math_agent = MathAgent()
        self.physics_agent = PhysicsAgent()
        self.chemistry_agent = ChemistryAgent()
        self.history_agent = HistoryAgent()
        self.image_vision = ImageVisionService()

    def route_image(
        self,
        image_base64: str,
        mime_type: str = "image/jpeg",
        user_note: str = "",
    ) -> dict:
        analysis = self.image_vision.analyze(image_base64, mime_type, user_note)

        if not analysis.get("in_scope"):
            summary = analysis.get("image_summary") or "your uploaded image"
            topic = analysis.get("detected_topic") or "another subject"
            reason = analysis.get("reason", "")
            response = (
                f"I read your image. **What I see:** {summary}\n\n"
                f"This tutor only answers questions in **Mathematics**, **Physics**, "
                f"**Chemistry**, and **History**.\n\n"
                f"Your image looks related to **{topic}**, which is outside these four subjects. "
                f"Please upload a question from Math, Physics, Chemistry, or History."
            )
            if reason:
                response += f"\n\n_{reason}_"
            return {
                "agent": "OutOfScope",
                "response": response,
                "reason": reason or "Question not in supported subjects.",
                "image_summary": summary,
            }

        subject = analysis.get("subject", "Unknown")
        question = analysis.get("extracted_question") or user_note.strip()
        if not question:
            question = "Solve the problem shown in the uploaded image."

        context = (
            f"[From uploaded image] {question}\n\n"
            f"Image context: {analysis.get('image_summary', '')}"
        )
        if user_note.strip():
            context += f"\nStudent note: {user_note.strip()}"

        return self._answer_with_agent(subject, context, analysis.get("reason", ""))

    def _answer_with_agent(self, subject: str, query: str, reason: str) -> dict:
        if subject == "MathAgent":
            result = self.math_agent.respond(query)
        elif subject == "PhysicsAgent":
            result = self.physics_agent.respond(query)
        elif subject == "ChemistryAgent":
            result = self.chemistry_agent.respond(query)
        elif subject == "HistoryAgent":
            result = self.history_agent.respond(query)
        else:
            result = BaseAgent(
                "BaseAgent",
                "This question is out of scope. Politely explain we only support "
                "Math, Physics, Chemistry, and History.",
            ).respond(query)
            subject = "Unknown"

        return {
            "agent": subject,
            "response": result,
            "reason": reason,
        }

    def route(self, messages: list[dict]) -> dict:
        # Trim message history to fit under token and message limit
        trimmed_messages = self._trim_messages(messages)

        # Extract latest question from user
        user_query = ""
        for msg in reversed(trimmed_messages):
            if msg["role"] == "user":
                user_query = msg["content"]
                break

        if not user_query:
            return {
                "agent": "Unknown",
                "response": "No user question found in the message history.",
                "reason": "Missing user query."
            }

        # Send classification request
        classification_prompt = trimmed_messages + [
            {
                "role": "user",
                "content": f"""Classify the following query (Keep in mind the previous messages as well):
                Query: {user_query}

                Respond in this JSON format:
                {{
                    "subject": "MathAgent" | "PhysicsAgent" | ChemistryAgent | HistoryAgent | "Unknown",
                    "reason": "<short explanation>"
                }}
                """
            }
        ]

        try:
            raw_response = super().respond(classification_prompt)
            data = self._parse_classification_response(raw_response, user_query)

            subject = data.get("subject", "Unknown")
            reason = data.get("reason", "No reason provided.")

            return self._answer_with_agent(subject, reason + user_query, reason)

        except Exception as e:
            return {
                "agent": "Unknown",
                "response": f"Classification failed. Error: {str(e)}",
                "reason": "Gemini classification failed."
            }

    def _parse_classification_response(self, raw_response: str, user_query: str) -> dict:
        if not raw_response:
            return {"subject": "Unknown", "reason": "Empty classifier response."}

        cleaned = raw_response.strip()
        # Handle fenced code blocks.
        if cleaned.startswith("```"):
            cleaned = cleaned.strip("`").strip()
            if cleaned.startswith("json"):
                cleaned = cleaned[4:].strip()

        # Try direct JSON parsing first.
        try:
            return json.loads(cleaned)
        except json.JSONDecodeError:
            pass

        # Try to parse the first JSON object-like block from the text.
        match = re.search(r"\{[\s\S]*\}", cleaned)
        if match:
            try:
                return json.loads(match.group(0))
            except json.JSONDecodeError:
                pass

        # Fallback: infer subject from text if model returned non-JSON prose.
        normalized = cleaned.lower()
        for agent_name in ["MathAgent", "PhysicsAgent", "ChemistryAgent", "HistoryAgent"]:
            if agent_name.lower() in normalized:
                return {
                    "subject": agent_name,
                    "reason": "Parsed subject from non-JSON classifier output."
                }

        # Final fallback to keep chat flowing instead of hard failure.
        return {
            "subject": "Unknown",
            "reason": f"Could not parse classifier JSON for query: {user_query[:80]}"
        }

    def _trim_messages(self, messages):
        # First limit by message count
        if len(messages) > MAX_MESSAGES:
            messages = messages[-MAX_MESSAGES:]

        # Then limit by token size approximation
        # total_chars = sum(len(m["content"]) for m in messages)
        # while total_chars > MAX_TOKENS_APPROX and len(messages) > 1:
        #     messages.pop(0)
        #     total_chars = sum(len(m["content"]) for m in messages)

        return messages
