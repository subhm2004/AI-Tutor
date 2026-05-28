LATEX_MATH_INSTRUCTIONS = """
When writing mathematics, always use LaTeX so equations render properly:
- Inline math: wrap in single dollar signs, e.g. $\\frac{d}{dx}(x^2) = 2x$
- Display math (equations on their own line): wrap in double dollar signs, e.g.
$$\\int_0^1 x^2 \\, dx = \\frac{1}{3}$$
Use standard LaTeX: \\frac, \\int, \\sum, \\lim, \\sqrt, \\partial, \\infty, subscripts with _, superscripts with ^.
Never put markdown (**, bullets, "Note that...") inside $$ ... $$ blocks.
Every $$ block must open and close on its own lines with valid LaTeX inside.
Show step-by-step work for derivatives, integrals, and algebra when helpful.
"""

FBD_INSTRUCTIONS = """
When the student asks for a free body diagram (FBD):

1. Start with a short heading and a markdown TABLE of forces (name, symbol, direction).
2. Draw the diagram using a plain-text ASCII sketch inside a ``` code block ``` (arrows with ↑ ↓ ← →).
3. Optionally add ONE small display-math block for force magnitudes only — use complete syntax, e.g.:
$$\\begin{array}{c}
N\\uparrow \\\\
\\downarrow W \\\\
f \\leftarrow \\; \\bullet \\; \\rightarrow T
\\end{array}$$
4. Put explanations ("Note that...", "Key concepts", bullet lists) OUTSIDE and AFTER all $$ blocks.
5. Never output \\end{array} without \\begin{array}{c} in the same $$ block.
6. Do not use \\text{...}\\\\ \\downarrow chains without \\begin{array}{c} ... \\end{array}.
"""

CHEMISTRY_LATEX_INSTRUCTIONS = """
For ALL chemistry calculations and formulas, use LaTeX (never plain ASCII math like E = E° - (RT/nF) * ln(Q)).

Rules:
- Inline: $E = E^{\\circ} - \\frac{RT}{nF}\\ln Q$
- Important equations on their own line in $$ ... $$, e.g. the Nernst equation:
$$E = E^{\\circ} - \\frac{RT}{nF}\\ln Q$$
- Standard potential: E^{\\circ} (not E°). Fractions: \\frac{RT}{nF} (not RT/nF). Multiply: \\cdot (not *).
- Subscripts: $n_{\\text{oxidation}}$, $K_{sp}$, $K_a$. Superscripts: $10^{-14}$, $\\Delta G^{\\circ}$.
- Chemical formulas ONLY with braced \\ce{...} (never \\ceFe or \\ceO2):
  inline $\\ce{H2O}$, $\\ce{O2}$, display $$\\ce{3Fe + 2O2 -> Fe3O4}$$
  Wrong: \\ceFe, \\ceO2. Right: \\ce{Fe}, \\ce{O2}, \\ce{3Fe + 2O2 -> Fe3O4}.
- Balance equations always in $$\\ce{...}$$ on their own line.
- Gas law: $$PV = nRT$$
- pH: $\\text{pH} = -\\log_{10}[\\ce{H+}]$
- Equilibrium: $$K_c = \\frac{[\\ce{C}]^c[\\ce{D}]^d}{[\\ce{A}]^a[\\ce{B}]^b}$$
- Show numerical substitution step-by-step in display math when solving numerically, e.g.
$$E = 0.34 - \\frac{(8.314)(298)}{(2)(96485)}\\ln(0.1) = 0.37\\,\\text{V}$$
Never write formulas as plain text on a single line without $ or $$ delimiters.
"""
