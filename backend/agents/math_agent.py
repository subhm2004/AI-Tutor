from .base_agent import BaseAgent
from .latex_instructions import LATEX_MATH_INSTRUCTIONS

class MathAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            "MathAgent",
            "You are a math expert. Help solve math problems and equations clearly."
            + LATEX_MATH_INSTRUCTIONS,
        )

    def respond(self, query: str) -> str:
        return super().respond(query)
