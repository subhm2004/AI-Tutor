from .base_agent import BaseAgent
from .latex_instructions import CHEMISTRY_LATEX_INSTRUCTIONS, LATEX_MATH_INSTRUCTIONS


class ChemistryAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            "ChemistryAgent",
            "You are a chemistry expert. Help solve chemistry problems, reactions, and numericals clearly. "
            + LATEX_MATH_INSTRUCTIONS
            + CHEMISTRY_LATEX_INSTRUCTIONS,
        )

    def respond(self, query: str) -> str:
        return super().respond(query)
