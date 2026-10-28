---
name: architecture-evolution
description: Evaluate when an existing architecture should evolve, compare alternatives and trade-offs, and record significant architectural decisions as ADRs without casually redesigning the system.
disable-model-invocation: false
---

# Architecture Evolution

## Purpose

Decide when an existing architecture has enough pressure or evidence to justify change.

This skill answers:

> **Why should the current architecture change, what alternatives exist, what are the trade-offs, and what decision should be recorded?**

It protects the project from two opposite failures:

```text
Architecture Drift
= changing structure casually

Architecture Rigidity
= refusing necessary evolution
```

---

# Invocation Gate

Do **not** invoke this skill merely because implementation is inconvenient, another pattern looks cleaner, or a shared abstraction feels desirable.

Required escalation:

```text
Concrete problem
  ↓
Evidence from repository / implementation
  ↓
Try smaller solution
  ↓
architecture-guardian confirms current boundary is insufficient
  ↓
architecture-evolution
```

This is an **exception path**, not a mandatory phase of every feature.

# 1. Start From Architectural Pressure

Do not change architecture because:

- another pattern looks cleaner
- a different tutorial uses it
- a new technology is available
- the current code is not aesthetically preferred
- the engineer personally prefers another style

Identify the concrete pressure first.

Examples:

- repeated violations of the same boundary
- duplicated infrastructure behavior
- growing coupling
- inability to satisfy a new requirement cleanly
- scalability constraint
- reliability problem
- performance constraint
- security requirement
- testability problem
- platform constraint
- persistent domain mismatch

Output:

```text
Architectural Pressure:
...

Evidence:
...

Affected Boundary:
...

Consequence If Unchanged:
...
```

---

# 2. Determine Whether Local Change Is Enough

Before changing architecture, test progressively smaller options:

```text
1. Reuse existing capability
2. Feature-local implementation
3. Extend existing abstraction
4. Introduce a focused abstraction
5. Change architectural boundary
6. Replace architectural approach
```

Prefer the smallest change that solves the actual problem.

Do not escalate directly to architectural redesign.

---

# 3. Distinguish Local Refactoring From Architecture Evolution

Not every refactor requires an architectural decision.

### Local Refactoring

Examples:

- rename
- extract method
- simplify component
- remove duplication inside one boundary
- reorganize private implementation

Usually no ADR is required.

### Architectural Evolution

Examples:

- introduce a new shared layer
- change dependency direction
- move ownership across feature/core boundaries
- replace a state-management approach
- introduce a new cross-cutting abstraction
- change module boundaries
- replace an integration strategy

These require explicit reasoning and normally an ADR.

---

# 4. Gather Evidence

Use:

`repository-discovery`

for repository evidence.

Use:

`shared-vs-feature-specific`

when deciding whether a responsibility belongs in shared infrastructure or inside a feature.

Use:

`architecture-guardian`

for the final architectural decision within the current implementation context.

This skill does not replace those skills.

---

# 5. Compare Alternatives

For significant changes, identify realistic alternatives.

```text
Option A:
...

Option B:
...

Option C:
...
```

Evaluate relevant dimensions:

- complexity
- coupling
- cohesion
- maintainability
- testability
- scalability
- performance
- reliability
- developer experience
- migration cost
- operational cost
- compatibility
- reversibility
- risk

Do not optimize every dimension simultaneously.

State which constraints matter for this decision.

---

# 6. Decision Threshold

Use a higher burden of proof as the blast radius increases.

```text
Feature-local change
    ↓ low evidence threshold

Shared abstraction
    ↓

Cross-feature boundary change
    ↓

Core architectural change
    ↓ high evidence threshold
```

The more consumers and dependencies affected, the stronger the evidence required.

---

# 7. Migration and Compatibility

If changing an existing architecture, define:

- current state
- target state
- migration path
- coexistence period if needed
- affected consumers
- compatibility strategy
- rollback strategy
- cleanup criteria

Avoid "big bang" migrations when incremental migration is safer.

---

# 8. ADR

For significant architectural decisions, record:

```text
Title:
...

Status:
Proposed | Accepted | Rejected | Superseded

Context:
...

Architectural Pressure:
...

Decision:
...

Alternatives Considered:
...

Trade-offs:
...

Consequences:
...

Migration:
...

Rollback:
...

Related Requirements:
...

Evidence:
...
```

An ADR records **why the decision exists**, not every implementation detail.

---

# 9. Reversal and Supersession

Architectural decisions are not permanent laws.

An existing ADR may become invalid when:

- requirements change
- scale changes
- technology constraints change
- a previous assumption becomes false
- new evidence invalidates the original trade-off

When that happens:

```text
Old ADR
→ New Evidence
→ New Decision
→ Supersede Old ADR
```

Do not silently rewrite history.

---

# 10. Stop Conditions

Stop and request more evidence when:

- the architectural pressure is only aesthetic preference
- alternatives have not been considered
- repository evidence is missing
- the proposed change has broad blast radius without justification
- critical requirements are ambiguous
- the trade-off cannot be evaluated with available information
- the proposed architecture solves a hypothetical future problem only

Do not invent architectural certainty.

---

# 11. Output

Produce:

```text
Architectural Pressure:
...

Evidence:
...

Current Architecture:
...

Why Current Approach Is Insufficient:
...

Options:
...

Trade-offs:
...

Recommended Decision For Review:
...

Blast Radius:
...

Migration:
...

Rollback:
...

ADR Required:
Yes | No

Open Questions:
...
```

The actual final architecture decision belongs to the appropriate decision owner, not to this analysis alone.

---

# Relationship With Other Skills

- `spec-kit-pre-implementation` owns the pre-implementation workflow.
- `repository-discovery` gathers repository evidence.
- `shared-vs-feature-specific` analyzes responsibility placement.
- `architecture-guardian` owns the final architectural decision for the current implementation.
- `architecture-evolution` evaluates whether an existing architecture should change and records the reasoning.
- `domain-invariants` identifies domain constraints that architecture must support.
- `state-and-data-flow` identifies state ownership and data movement.
- `async-consistency` identifies concurrency/consistency pressures.
- `testing-proof` provides behavioral evidence.
- `implementation-validation` validates the resulting implementation.

Do not use this skill as a generic architecture review checklist.

---

## Core Principle

> **Change architecture because the system has demonstrated a need for change, not because a different architecture looks better.**
