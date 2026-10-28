---
name: coupling-cohesion
description: Analyze software boundaries for coupling, cohesion, dependency direction, responsibility concentration, and change impact using practical evidence rather than abstract metrics alone.
disable-model-invocation: false
---

# Coupling & Cohesion

## Purpose

Evaluate whether responsibilities and dependencies are arranged so that the system can change safely and locally.

This skill answers two questions:

> **Is this boundary internally coherent?**

and:

> **How much does this boundary depend on unrelated things outside itself?**

The goal is not to eliminate coupling.

The goal is:

```text
High Cohesion
+
Intentional / Manageable Coupling
+
Clear Dependency Direction
→
Safer Change
```

---

# Execution Role

Use this skill as a **boundary review lens** during architecture and implementation; it does not independently decide the architecture.

```text
repository-discovery → evidence
shared-vs-feature-specific → placement analysis
architecture-guardian → architectural decision
coupling-cohesion → coupling/cohesion assessment
```

If evidence contradicts the design: **STOP → return the finding to `architecture-guardian` → use `architecture-evolution` only if smaller changes are insufficient.**

# 1. Identify the Boundary

Analyze a concrete unit:

- component
- service
- feature
- module
- library
- shared abstraction
- domain object
- state store
- API boundary

Start by identifying:

```text
Boundary:
...

Primary Responsibility:
...

Consumers:
...

Dependencies:
...

Outputs:
...
```

Do not evaluate coupling without first defining the boundary.

---

# 2. Cohesion

Cohesion asks:

> **Do the responsibilities inside this boundary belong together?**

Look for a clear reason for the boundary to change.

Strong cohesion often means:

```text
One meaningful responsibility
→ related behavior
→ related state
→ related dependencies
```

Weak cohesion often looks like:

```text
Feature A behavior
+
Feature B behavior
+
UI helper
+
API transformation
+
unrelated utility
```

inside one abstraction.

---

# 3. Change-Reason Test

For a class/module/service/component, list realistic reasons it may change.

```text
Reason 1:
...

Reason 2:
...

Reason 3:
...
```

Then ask:

> Are these reasons part of the same responsibility?

If unrelated business or technical concerns repeatedly change together only because they share a file, cohesion may be weak.

Do not treat file size alone as proof of poor cohesion.

---

# 4. Dependency Coupling

List meaningful dependencies:

```text
Boundary
 ↓
Dependency A
Dependency B
Dependency C
```

Classify them:

- domain dependency
- infrastructure dependency
- UI dependency
- framework dependency
- feature dependency
- shared dependency
- external dependency

Ask:

> Which dependencies are actually necessary for the responsibility?

---

# 5. Dependency Direction

Check:

```text
Who depends on whom?
Who owns the contract?
Can the dependency direction be explained?
```

Prefer dependency direction that reflects ownership and architectural boundaries.

Watch for:

```text
Feature A
→ Feature B
→ Feature C
→ Shared
```

when the dependency is actually a missing shared contract.

Also watch for:

```text
Shared
→ Feature-specific
```

which often indicates an architectural boundary violation.

Do not label a dependency wrong merely because it exists.

Explain why its direction is problematic.

---

# 6. Change Impact

One of the strongest practical coupling signals is change propagation.

Ask:

> If this responsibility changes, how many unrelated places must change?

Model:

```text
Change X
→ Boundary A
→ Boundary B
→ Boundary C
```

Potential indicators of excessive coupling:

- unrelated consumers break
- consumers know internal details
- one change requires coordinated edits across many features
- shared abstraction exposes feature-specific concepts
- API shape is controlled by unrelated consumers

---

# 7. Consumer Knowledge

Healthy boundaries hide implementation details.

Check whether consumers depend on:

```text
Public Contract
```

or:

```text
Internal Implementation
```

Examples of excessive knowledge:

- reaching into another feature's state
- manipulating another component's internal state
- depending on private data structures
- importing feature internals instead of a stable contract
- relying on incidental lifecycle behavior

Prefer stable contracts over implementation knowledge.

---

# 8. Abstraction Coupling

Generic abstractions can create coupling when they accumulate exceptions.

Watch for:

```text
Generic Service
├── if Feature A
├── if Feature B
├── if Feature C
└── specialCaseForD
```

This may indicate that a shared abstraction is absorbing unrelated business behavior.

Coordinate with:

`shared-vs-feature-specific`

and:

`architecture-guardian`.

Do not conclude that generic code is bad simply because it has many consumers.

---

# 9. Cohesion Through State

State is a strong cohesion signal.

Ask:

> Does this state belong to the responsibility that owns it?

Warning signs:

- one state object controls unrelated features
- duplicated state exists in several boundaries
- a component owns state that only another feature understands
- shared service stores feature-specific state
- UI state and domain state are mixed without a reason

Coordinate state ownership with:

`state-and-data-flow`.

---

# 10. Temporal Coupling

Some dependencies are not structural; they depend on ordering.

Examples:

```text
Call A
→ must happen before B

Initialize X
→ before consumer Y runs
```

Ask:

- Is the ordering requirement explicit?
- Can the consumer accidentally run too early?
- Is lifecycle timing part of the contract?

Coordinate runtime-specific cases with:

`angular-runtime`

and async ordering with:

`async-consistency`.

---

# 11. Coupling Types

Use practical categories:

### Data Coupling

A boundary receives only the data it needs.

Generally easier to reason about.

### Control Coupling

One boundary controls another through flags/modes.

Watch for APIs such as:

```text
execute(mode = "A")
execute(mode = "B")
execute(mode = "C")
```

when the modes represent different responsibilities.

### Shared-State Coupling

Multiple boundaries mutate the same state.

High risk when ownership is unclear.

### Common Coupling

Multiple boundaries depend on the same global mutable state.

Identify the authority and mutation paths.

### Content Coupling

One boundary reaches into another's internals.

Treat as a strong boundary smell.

Do not classify mechanically; explain the consequence.

---

# 12. Cohesion Smells

Look for:

- unrelated responsibilities in one boundary
- unrelated reasons to change
- large conditional branches for different features
- feature-specific exceptions inside generic code
- state that belongs elsewhere
- methods that operate on unrelated subsets of data
- abstractions with multiple unrelated concepts

A large file is not automatically low-cohesion.

A small file can still have poor cohesion.

---

# 13. Coupling Smells

Look for:

- deep dependency chains
- circular dependencies
- shared mutable state
- feature-to-feature internals
- excessive constructor dependencies
- leaking implementation details
- generic abstractions controlled by specific features
- duplicated contracts caused by unclear ownership
- coordination across many modules for one small change

Again:

> Identify the actual consequence, not just the smell.

---

# 14. Practical Refactoring Options

When coupling/cohesion is weak, consider progressively smaller changes:

```text
1. Clarify the contract
2. Hide internal details
3. Move a responsibility
4. Extract a focused abstraction
5. Introduce a stable shared contract
6. Change dependency direction
7. Split the boundary
8. Evolve architecture
```

Prefer the smallest change that improves the actual problem.

If the change affects architectural boundaries, coordinate with:

`architecture-evolution`

and:

`architecture-guardian`.

---

# 15. Do Not Optimize for Zero Coupling

Some coupling is desirable.

Examples:

```text
Feature
→ Domain Contract

Component
→ Feature Service

Feature
→ Shared UI Component
```

The question is not:

> Can we remove this dependency?

The question is:

> Is this dependency intentional, stable, and appropriate for the responsibility?

---

# 16. Practical Evidence

Use evidence such as:

- dependency graph
- import direction
- public API shape
- constructor dependencies
- state ownership
- change history when available
- repeated exceptions
- number and type of consumers
- test setup complexity
- feature boundaries
- change propagation

Do not rely on arbitrary numeric thresholds.

Metrics can support reasoning but should not replace it.

---

# 17. Stop Conditions

Stop and investigate when:

- ownership is unclear
- dependency direction conflicts with architecture rules
- a shared abstraction contains unexplained feature-specific behavior
- multiple boundaries mutate the same critical state
- the proposed split is based only on file size
- the proposed abstraction is based only on hypothetical reuse
- evidence is insufficient to identify the real change impact

Do not refactor merely to improve a metric.

---

# 18. Output

Produce:

```text
Boundary:
...

Primary Responsibility:
...

Cohesion Assessment:
Strong | Mixed | Weak

Reasons To Change:
...

Dependencies:
...

Dependency Direction:
...

Coupling Risks:
...

Change Impact:
...

Consumer Knowledge:
...

State Ownership:
...

Recommended Smallest Improvement:
...

Architectural Impact:
None | Local | Shared | Boundary Change

Related Skills:
...

Open Questions:
...
```

Do not produce an overall numeric score unless the project explicitly defines one.

---

# Relationship With Other Skills

- `repository-discovery` provides dependency and ownership evidence.
- `shared-vs-feature-specific` determines whether a responsibility belongs in shared or feature scope.
- `state-and-data-flow` analyzes state ownership and movement.
- `coupling-cohesion` evaluates responsibility boundaries and dependency relationships.
- `architecture-guardian` decides the current architectural structure.
- `architecture-evolution` evaluates whether broader architectural change is justified.
- `domain-invariants` identifies business constraints that boundaries must preserve.
- `angular-runtime` handles framework lifecycle/runtime behavior.
- `async-consistency` handles temporal/concurrent dependencies.
- `testing-proof` provides behavioral evidence.
- `implementation-validation` validates the final implementation.

Do not turn this skill into a generic SOLID lecture.

---

## Core Principle

> **Good architecture does not remove coupling; it makes important coupling intentional, visible, and aligned with responsibility ownership.**
