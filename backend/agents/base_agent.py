import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()


class BaseAgent:
    def __init__(self, name: str, instructions: str):
        self.name = name
        self.instructions = instructions
        self.client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
        self.model = os.environ.get("GROQ_MODEL", "llama-3.1-8b-instant")

    def _build_messages(self, query):
        messages = [{"role": "system", "content": self.instructions}]

        if isinstance(query, list):
            for msg in query:
                role = msg.get("role", "user")
                content = str(msg.get("content", "")).strip()
                if content:
                    messages.append({"role": role, "content": content})
        else:
            messages.append({"role": "user", "content": str(query)})

        return messages

    def respond(self, query) -> str:
        try:
            completion = self.client.chat.completions.create(
                model=self.model,
                messages=self._build_messages(query),
                temperature=0.2,
            )
            return completion.choices[0].message.content or ""
        except Exception as e:
            return f"Agent {self.name} failed: {str(e)}"
