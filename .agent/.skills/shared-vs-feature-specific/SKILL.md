---
name: shared-vs-feature-specific
description: Determines whether functionality belongs in shared infrastructure or feature-specific code by evaluating responsibility, reuse evidence, business context, and stable abstraction boundaries.
disable-model-invocation: false
---

# Shared vs Feature-Specific

## Purpose

Determine the correct architectural home for a responsibility.

The goal is to prevent two opposite problems:

1. Duplicating functionality that should be reused.
2. Over-generalizing feature-specific business logic.

Do not decide based only on how similar two pieces of code look.

Decide based on responsibility, ownership, and evidence of reuse.

---

# Boundary With Architecture Guardian

This skill answers a narrower question:

> **Where should this responsibility live?**

It is a **placement analysis**, not the final architecture decision.

Use it to determine whether a responsibility is:

- shared/generic
- feature-specific/business-owned
- a candidate for extending existing shared infrastructure
- a candidate for a new shared abstraction

Then hand the result to `architecture-guardian` when the decision affects an established architectural boundary, introduces a new abstraction, or requires changing shared infrastructure.

`architecture-guardian` owns the final architectural decision:

> **What architectural change, if any, is justified?**

Do not duplicate its broader decision model here.

Typical flow:

```text
Requirement / Spec
      ↓
Repository Discovery
      ↓
Shared vs Feature-Specific
      ↓
Placement Evidence
      ↓
Architecture Guardian
      ↓
Architectural Decision
```

For a simple feature-local responsibility, this skill may be sufficient.

For cross-feature/shared changes, the output should become evidence for `architecture-guardian`.

---

# Core Principle

Shared code should represent a stable generic responsibility.

Feature-specific code should represent business or domain behavior.

Code should not become shared simply because:

- it may be reused someday
- two lines look similar
- multiple features contain similar HTML
- duplication feels uncomfortable

Code should not remain duplicated when the repository already has a reusable implementation that clearly owns the same responsibility.

---

# The Decision Model

Before placing code in shared infrastructure, ask:

## Question 1: Is the responsibility generic?

Does it describe a stable capability independent of a specific business domain?

Example:

```text
Modal behavior
Table rendering
Input interaction
File selection
Pagination UI

These are likely generic responsibilities.

Question 2: Does it contain business meaning?

Does the behavior depend on:

a specific feature
a specific entity
domain rules
business validation
business terminology
feature-specific workflow

If yes, it likely belongs inside the feature.

Example:

Order pricing
Student enrollment rules
Product type validation
Conversation message workflow

These are feature-specific responsibilities.

Question 3: Is there evidence of reuse?

Before creating shared code, look for actual reuse evidence.

Strong evidence:

multiple features currently need the same behavior
an existing generic contract already supports it
the responsibility is independent of one feature
the API can be described without domain terminology

Weak evidence:

"we might need this later"
"another feature could probably use it"
"it looks reusable"

Do not create shared abstractions based only on weak evidence.

Question 4: Can the contract remain stable?

A shared abstraction should have a clear contract.

If generalizing it requires:

many feature-specific flags
multiple unrelated callbacks
large configuration objects
feature-specific conditions
domain-specific names

then the abstraction may be wrong.

A generic abstraction should not become a container for unrelated business rules.

Reuse Before Extraction

Before extracting duplicate-looking code, inspect whether:

the responsibilities are actually identical
the lifecycle is similar
the inputs are similar
the outputs are similar
the business meaning is independent of the feature

Only then consider sharing the implementation.

Similar code does not always mean identical responsibility.

Feature-Specific Examples

The following usually belong to the feature:

feature pages
feature-specific forms
feature-specific validation
domain calculations
entity-specific table configuration
business action handling
feature-specific details components
feature-specific FormArray logic
feature-specific API mapping
feature-specific workflow

Example:

Generic Table
    ↓
Shared

Orders Table Columns
    ↓
Feature-Specific

Student Details Page
    ↓
Feature-Specific

Generic Modal Shell
    ↓
Shared

Order Edit Form
    ↓
Feature-Specific
Shared Infrastructure Examples

The following may belong to shared infrastructure when the repository already uses them generically:

UI modal shell
generic table
generic input
generic select
reusable button
image upload UI
reusable pagination
loading infrastructure
generic CRUD behavior
generic query infrastructure

Do not recreate these inside features.

Extend vs Create

When an existing shared abstraction almost supports the requirement, do not immediately create another one.

Evaluate whether the existing abstraction can be extended.

Use this rule:

Existing component
        ↓
Supports requirement?
        │
   ┌────┴────┐
   │         │
  Yes       No
   │         │
Reuse    Can extension remain generic?
             │
        ┌────┴────┐
        │         │
       Yes       No
        │         │
     Extend   Feature-specific solution

Do not add feature-specific logic to a shared component merely to avoid creating a feature component.

Configuration Is Not Business Logic

A shared component may receive configuration.

Example:

GenericTable
    ↓
Columns Configuration
    ↓
Feature

The feature may configure:

columns
labels
visible fields
action definitions

The shared component should not interpret domain meaning.

Avoid:

if feature === 'orders'
    apply order logic

Avoid:

if feature === 'students'
    apply student logic

A shared component should remain generic through a stable contract, not through feature-name conditions.

Form Responsibility

Shared form controls should own generic interaction.

Feature forms should own business data.

Example:

Shared Input
├── input interaction
├── generic validation display
└── UI state

Order Form
├── order fields
├── order validation
├── order mapping
└── order submission

Student Form
├── student fields
├── student validation
├── student mapping
└── student submission

Do not move order or student rules into the shared input.

Dynamic Forms and FormArray

A dynamic collection does not automatically require a generic abstraction.

Example:

Stationery Product Form
    ↓
FormArray
    ↓
Feature-specific dynamic items

If the dynamic collection represents a specific business structure, keep it feature-specific.

Create a generic dynamic form abstraction only when:

the same interaction exists across multiple features
the contract is independent of business terminology
the API is stable
The Three-Feature Test

Do not apply this mechanically.

Use it as evidence.

If similar behavior appears across multiple features:

First occurrence

Implement it clearly inside the feature.

Second occurrence

Compare responsibilities.

Identify whether a real common contract exists.

Third occurrence

Consider shared extraction if the responsibilities and contracts are genuinely aligned.

The goal is not to wait for exactly three copies.

The goal is to collect enough evidence before abstraction.

Avoid Premature Abstraction

Premature abstraction creates:

unclear APIs
excessive configuration
feature flags
coupling
difficult maintenance

A bad abstraction is often worse than small local duplication.

Prefer:

Clear Feature Code
        ↓
Observe Repetition
        ↓
Understand Common Responsibility
        ↓
Extract Stable Contract

Do not start with:

Predict Future Reuse
        ↓
Build Generic System
        ↓
Force Features Into It
Extraction Checklist

Before moving feature code to shared infrastructure, verify:

Is the responsibility generic?
Is there real reuse evidence?
Is the contract independent of one business domain?
Can the API remain simple?
Will the abstraction avoid feature-specific flags?
Does existing shared infrastructure already solve it?

If the answer is unclear, keep the code feature-specific.

Decision Output

For each responsibility, classify it as:

Reuse Existing

The repository already contains the correct shared capability.

Extend Shared

The existing generic abstraction can support the requirement through a justified generic extension.

Feature-Specific

The responsibility contains business meaning and belongs to the current feature.

New Shared Abstraction

Create only when reuse evidence and a stable generic contract exist.

Final Principle

Do not ask:

Can this code be generic?

Ask:

Is this responsibility genuinely generic?

Do not ask:

Could another feature use this?

Ask:

Does the repository already demonstrate a stable shared responsibility?

The correct architecture is not:

Maximum Reuse

and it is not:

Maximum Isolation

The goal is:

Correct Responsibility Boundaries

Always prefer:

Evidence Before Abstraction

and:

Feature-Specific Until Reuse Is Proven
