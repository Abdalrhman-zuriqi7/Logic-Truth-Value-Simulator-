# Logic & Truth Value Simulator

An interactive web application for learning, analyzing, and exploring **Propositional Logic** through Truth Tables, logical evaluation, and equivalence checking.

The project combines mathematical logic with software engineering to create an educational tool that allows users to write logical propositions, analyze their structure, evaluate every possible truth assignment, and understand why a proposition is classified as a tautology, contradiction, or contingency.

---

## 📌 Project Overview

Logic can initially appear difficult because it uses unfamiliar symbols such as:

- `~`
- `^`
- `v`
- `->`
- `<->`

This project transforms those abstract symbols into something visual and interactive.

Instead of manually calculating every possible case, the simulator automatically:

1. Reads the logical expression.
2. Checks whether its syntax is valid.
3. Identifies the variables used.
4. Generates every possible truth assignment.
5. Evaluates the proposition for every assignment.
6. Displays intermediate evaluation steps.
7. Classifies the proposition.
8. Compares two propositions for logical equivalence.

The goal is not only to calculate the answer, but also to make the reasoning process understandable.

---

# 🎯 Main Features

## 1. Logical Expression Parser

The application supports common propositional-logic operators.

### Variables

The simulator supports variables such as:

```text
P
Q
R
S