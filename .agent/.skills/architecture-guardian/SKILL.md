---
name: architecture-guardian
description: Decide whether an approved change should reuse, extend, isolate, or introduce architecture while protecting existing boundaries and minimizing unnecessary change.
disable-model-invocation: false
---

# Architecture Guardian

## Responsibility

This skill answers one question:

> **Given the requirement and repository evidence, what architectural change—if any—is justified?**

It does **not** discover the repository from scratch.

Use `repository-discovery` first when repository evidence is missing.

Use `shared-vs-feature-specific` when the key question is whether a responsibility belongs in shared infrastructure or inside a feature. Treat its result as placement evidence, not as the final architecture decision.

---

# Input Contract

Expect:

```text
Approved Requirement / Spec
+
Repository Discovery Evidence
+
Relevant Existing Architecture
```

If these are missing for a non-trivial task, stop and request discovery rather than guessing.

---

# Decision Model

Classify the required change as exactly one primary decision:

```text
Reuse
Extend
Feature-Specific
New Abstraction
Architectural Change
```

## Reuse

Use an existing implementation unchanged when its contract satisfies the requirement.

## Extend

Modify an existing generic responsibility when the new behavior belongs to that same responsibility and the contract remains coherent.

## Feature-Specific

Keep behavior inside the feature when the requirement represents business behavior or responsibility unique to that feature.

## New Abstraction

Create a new abstraction only when:

- the responsibility is clearly defined
- existing infrastructure does not satisfy it
- the contract is stable enough to generalize
- reuse is real rather than speculative

## Architectural Change

Change an established architectural boundary only when the current structure creates a demonstrated problem for the requested behavior.

Do not change architecture because another design is personally preferred.

---

# Existing Architecture Has Priority

Preserve working architecture by default.

Do not:

- rewrite working features
- introduce parallel infrastructure
- move responsibilities without evidence
- refactor unrelated code
- generalize prematurely

The burden of proof is higher for shared or cross-feature changes.

---

# Architecture Change Gate

Before breaking an existing boundary, identify:

```text
Current Boundary
Problem
Evidence
Impact
Alternatives Considered
Chosen Change
Why Smaller Change Is Insufficient
Migration / Regression Risk
```

If the problem can be solved without changing the boundary, prefer the smaller solution.

If the evidence is insufficient, stop.

---

# State Ownership

Every important state must have one clear owner.

Determine:

- who creates it
- who updates it
- who controls its lifecycle
- who consumes it
- which source is authoritative

Do not move business state into shared presentation components merely for convenience.

---

# Shared Infrastructure Rule

Shared infrastructure owns mechanisms with stable generic contracts.

Features own business meaning.

Prefer:

```text
Shared:
generic table behavior
generic modal behavior
query mechanism
CRUD mechanism

Feature:
what "Approve Order" means
what "Cancel Reservation" means
which route opens after an action
```

Do not put feature-specific business rules into generic infrastructure.

---

# Dependency Direction

Prefer dependencies that preserve architectural ownership:

```text
Feature
  ↓
Shared / Core mechanism
```

Avoid:

```text
Shared
  ↓
Feature-specific business logic
```

A shared abstraction that needs to know a specific feature's business rules is a strong signal that the boundary is wrong.

---

# Scope Protection

Only change files and boundaries required by the approved task.

Do not bundle:

- cleanup
- naming campaigns
- unrelated refactors
- speculative abstractions
- unrelated migrations

into an otherwise local feature change.

---

# Architecture Decision Output

Before implementation, produce:

```text
Architecture Decision

Requirement:
...

Existing Boundary:
...

Decision:
Reuse | Extend | Feature-Specific | New Abstraction | Architectural Change

Why:
...

Files / Areas Affected:
...

Rejected Alternatives:
...

Risk:
...

Scope:
...
```

For normal feature work, keep this concise.

For a genuine architectural change, make the reasoning explicit enough to serve as an ADR input.

---

# Hard Stop

Stop when:

- discovery evidence conflicts
- ownership is ambiguous
- an architectural change is required but its justification is weak
- a shared contract would become feature-specific
- two existing architectural boundaries conflict
- the approved specification contradicts the current architecture and no decision has been made

Do not resolve architectural ambiguity by creating another implementation.

---

# Final Rule

Repository Discovery answers:

> **What exists?**

Architecture Guardian answers:

> **What should we do with it?**

Implementation Skills answer:

> **How do we build the approved decision?**
