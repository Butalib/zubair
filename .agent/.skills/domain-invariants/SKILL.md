---
name: domain-invariants
description: Identify business invariants, legal and illegal states, state transitions, ownership, enforcement points, and failure behavior before implementation.
disable-model-invocation: false
---

# Domain Invariants

## Purpose

Turn business rules into explicit, enforceable system constraints.

This skill answers:

> **What must always be true in the domain, which states are legal, who owns the rule, and what prevents illegal state transitions?**

A business rule is not complete when it is merely written in prose.

It becomes engineering-ready when we can identify:

```text
Business Rule
→ Invariant
→ Valid / Illegal State
→ State Transition
→ Owner
→ Enforcement
→ Failure Behavior
→ Testable Proof
```

---

# 1. Extract the Business Rule

Start from the requirement, user story, or domain behavior.

Separate:

- business intent
- user action
- data constraint
- lifecycle rule
- authorization rule
- temporal rule
- relationship constraint

Do not convert technical implementation details into domain rules.

---

# 2. Define the Invariant

An invariant is a condition that must remain true whenever the domain is in a valid state.

Examples:

```text
An order cannot be completed before it is accepted.

A reservation cannot have overlapping confirmed bookings
for the same resource and time window.

A completed order cannot return to an editable state.
```

Prefer precise statements over vague language such as:

- "should work"
- "normally"
- "probably"
- "make sure"

---

# 3. Identify Legal and Illegal States

For each important entity or workflow, define:

```text
Legal State:
...

Illegal State:
...

Why illegal:
...
```

Do not assume that every combination of fields is valid.

Look for illegal combinations such as:

```text
status = completed
AND
editable = true
```

or:

```text
reservation = confirmed
AND
time range = overlapping confirmed reservation
```

---

# 4. Model State Transitions

For lifecycle-based domains, explicitly model transitions.

```text
Current State
    ↓
Action / Event
    ↓
Validation
    ├── Allowed → New State
    └── Rejected → Failure Behavior
```

Example:

```text
Pending
 ├── Accept → Accepted
 └── Reject → Rejected

Accepted
 ├── Complete → Completed
 └── Cancel → Cancelled

Completed
 └── No further lifecycle mutation
```

A transition must define:

- source state
- triggering action/event
- preconditions
- resulting state
- rejected transitions
- failure behavior

---

# 5. Identify Rule Ownership

For each invariant, determine the narrowest layer that can reliably enforce it.

Possible owners:

- UI validation
- Feature/application layer
- Domain model/service
- API/backend
- Database constraint

Important:

> UI validation improves feedback but is not sufficient as the sole enforcement point for critical business invariants.

If the backend is the authoritative system, critical invariants must ultimately be enforced there.

Do not invent backend guarantees when working on a frontend-only project.

---

# 6. Enforcement Strategy

For each invariant:

```text
Invariant:
...

Authoritative Owner:
...

Client-side Guard:
...

Server-side Enforcement:
...

Database Constraint:
...

Reason:
...
```

Only include mechanisms that actually exist or are explicitly planned.

Distinguish:

```text
Validation
```

from:

```text
Enforcement
```

A disabled button is not domain enforcement.

---

# 7. Failure Behavior

When an invariant blocks an action, define:

- what fails
- what remains unchanged
- what the user sees
- whether retry is possible
- what action can make the operation valid

Coordinate detailed failure/recovery behavior with:

`error-state-design`

Do not duplicate its error taxonomy.

---

# 8. Concurrency and Consistency Flags

If an invariant can be violated by concurrent operations, flag it.

Examples:

```text
Two users can confirm the same resource simultaneously.
```

or:

```text
Two updates can overwrite each other's changes.
```

Mark:

```text
Concurrency Risk:
Yes | No

Required Consistency Mechanism:
...
```

Hand detailed race/cancellation/cache behavior to:

`async-consistency`

---

# 9. Temporal and Relational Invariants

Check rules involving:

### Time

- deadlines
- expiration
- scheduling
- overlapping intervals
- ordering

### Relationships

- parent/child existence
- uniqueness
- ownership
- dependent records
- aggregate consistency

### Quantities

- minimum/maximum
- capacity
- balances
- counts
- limits

Do not reduce these to simple field validation when they describe domain behavior.

---

# 10. Ambiguity and Stop Conditions

Stop instead of guessing when:

- two requirements contradict each other
- the legal state is unclear
- the state transition is unspecified
- ownership of a critical invariant is unknown
- the source of truth is unclear
- failure behavior can cause data inconsistency
- the rule depends on an unstated business policy

Record:

```text
Open Question:
...

Why It Matters:
...

Decision Needed From:
...
```

Critical domain assumptions must be resolved before implementation.

---

# 11. Output

Produce a compact invariant table:

```text
Invariant:
...

Business Rule:
...

Legal State:
...

Illegal State:
...

Allowed Transition:
...

Rejected Transition:
...

Authoritative Owner:
...

Enforcement:
...

Failure Behavior:
...

Concurrency Risk:
...

Testable Proof:
...

Open Question:
...
```

The result should be usable by:

- `spec-kit-pre-implementation`
- `architecture-guardian`
- `state-and-data-flow`
- `async-consistency`
- `testing-proof`
- `implementation-validation`

---

# Relationship With Other Skills

- `spec-kit-pre-implementation` owns the pre-implementation workflow.
- `repository-discovery` supplies repository evidence.
- `domain-invariants` defines domain truths and legal state transitions.
- `state-and-data-flow` owns state ownership and data movement.
- `architecture-guardian` decides architectural structure needed to support the rule.
- `error-state-design` defines user-facing failure and recovery behavior.
- `async-consistency` handles concurrency, stale data, cancellation, and consistency mechanics.
- `testing-proof` proves the invariant behavior with executable tests.
- `implementation-validation` validates that implementation satisfies the approved invariant requirements.

Do not turn this skill into a generic business-analysis or testing skill.

---

## Core Principle

> **If an important business rule cannot be expressed as a valid state, illegal state, or allowed/rejected transition, it is probably not yet engineering-ready.**
