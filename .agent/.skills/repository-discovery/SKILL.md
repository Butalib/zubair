---
name: repository-discovery
description: Discover repository evidence before planning or implementation, using existing project artifacts and patterns to determine where a requirement belongs and what can be reused.
disable-model-invocation: false
---

# Repository Discovery

## Responsibility

This skill answers one question:

> **What already exists in this repository, where does the requested responsibility belong, and what evidence should the implementation plan use?**

It does **not** own:
- project-wide execution workflow
- business-rule modeling
- architectural approval
- implementation
- testing strategy

Use the repository as evidence. Do not design from assumptions.

---

# Relationship With Spec Kit

If the project uses GitHub Spec Kit, this skill supports its specification/planning workflow.

Spec Kit owns the workflow:

```text
specify
→ clarify
→ plan
→ tasks
→ analyze
→ implement
→ converge
```

Repository Discovery supplies repository evidence to those stages.

Do not recreate this workflow inside this skill.

During discovery:

- inspect the current repository
- inspect existing Spec Kit artifacts when present
- use approved specification/clarifications as task context
- use the plan as implementation context
- never silently rewrite approved specification decisions

If a required decision is missing from the specification, report the gap instead of inventing it.

---

# When To Run

Run repository discovery before creating or modifying non-trivial code.

It is especially required when the task involves:

- a new feature
- a new page or screen
- a new service
- a shared component
- a state change
- a data-flow change
- routing
- API integration
- replacing existing infrastructure
- modifying a cross-feature responsibility

For a trivial isolated change, use proportional discovery rather than performing a full repository audit.

---

# Discovery Process

## 1. Understand the Requested Change

Extract only what is needed to search effectively:

- requested capability
- affected user flow
- affected data
- likely feature
- likely technology boundary
- known constraints

Do not turn this into architecture design.

The output at this stage is a search target.

---

## 2. Locate the Feature

Find the closest existing feature/module/package.

Inspect relevant:

- pages/screens
- components/widgets
- services
- models/interfaces
- routes
- module configuration
- state/query code

Determine where the current responsibility already lives.

---

## 3. Find Similar Implementations

Search by **responsibility**, not only by the exact wording of the task.

Examples:

```text
details
view
profile
route parameter
getById
```

for a details flow.

```text
upload
image
file
attachment
preview
```

for upload behavior.

```text
loading
pending
spinner
request
```

for loading behavior.

Prefer recent, working implementations that match the current architecture.

Priority:

```text
Current feature
→ Closely related feature
→ Recent implementation
→ Shared infrastructure
→ Legacy implementation
```

Do not copy legacy behavior blindly.

---

## 4. Discover Reusable Infrastructure

Inspect relevant shared/core/common/infrastructure areas for:

- shared components
- generic components
- services
- CRUD infrastructure
- query infrastructure
- state utilities
- forms
- validation
- routing patterns
- interceptors
- upload utilities
- UI primitives

For every candidate, determine whether it is:

```text
Reusable as-is
Needs extension
Feature-specific
Not suitable
```

Do not decide to create a new abstraction merely because an existing one is imperfect.

---

## 5. Trace Data and State

Trace the existing path:

```text
Source
↓
Service / Repository
↓
Feature Owner
↓
Presentation
↓
User Action
↓
Event / Command
↓
State Mutation
↓
Updated Consumer
```

Identify the actual implementation path.

Do not create a second path for the same responsibility without a justified architectural decision.

For important state identify:

- owner
- writer
- lifecycle
- consumers
- source of truth

---

## 6. Build an Evidence Map

Produce a compact map:

```text
Requirement
    ↓
Relevant Feature
    ↓
Similar Implementation
    ↓
Reusable Infrastructure
    ↓
Existing Data / State Flow
    ↓
Actual Gap
```

The goal is to establish evidence before architectural decisions are made.

---

# Discovery Output

Before planning or implementation, produce:

## Feature Location

Relevant feature and main files.

## Existing Pattern

Closest current implementation and why it is relevant.

## Reusable Infrastructure

What can be reused and what contract it provides.

## Data / State Flow

Current flow and ownership.

## Gap

What is actually missing.

## Scope Candidates

```text
Reuse:
...

Modify:
...

Create:
...
```

## Evidence / Uncertainty

List anything that could not be verified.

---

# Stop Conditions

Stop discovery and surface a decision when:

- two competing patterns appear equally current
- ownership is unclear
- existing implementations contradict each other
- a shared abstraction may be unsuitable but the reason is uncertain
- the requested behavior conflicts with an approved specification
- the repository does not contain enough evidence to determine the correct location

Use:

```text
🛑 DISCOVERY BLOCKER

Found:
...

Conflict / Missing Evidence:
...

Why it matters:
...

Decision or evidence required:
...
```

Do not resolve uncertainty by inventing a third pattern.

---

# Handoff To Architecture

Repository Discovery does **not** decide whether architecture should be preserved, extended, or changed.

It hands evidence to the architecture decision layer.

Expected handoff:

```text
Discovery
    ↓
Evidence
    ↓
Architecture Guardian
    ↓
Reuse / Extend / Feature-Specific / New Abstraction
```

This separation is intentional.

Discovery answers:

> What exists?

Architecture answers:

> What should we do with what exists?

---

# Handoff To Implementation

Implementation should consume the approved discovery and architecture decisions.

Do not continue from discovery directly to code when the task requires architectural judgment.

Expected flow:

```text
Spec Kit / Approved Requirement
        ↓
Repository Discovery
        ↓
Architecture Decision
        ↓
Technology-Specific Implementation
```

---

# Scope Protection

Discovery does not grant permission to refactor.

Finding imperfect code is evidence, not authorization.

Do not modify unrelated code because you discovered:

- old naming
- duplicated patterns
- legacy implementation
- possible cleanup
- preferred architecture

Only surface these as findings unless the current task explicitly requires them.

---

# Proportionality

Do not scan the entire repository for every task.

Use the smallest discovery scope that can answer the relevant questions.

For example:

```text
Button styling change
→ inspect owning component + existing styling tokens

New Orders feature
→ inspect Orders + related CRUD + shared table/query infrastructure

Shared query change
→ inspect all known consumers before changing the shared contract
```

The larger the blast radius, the broader the discovery.

---

# Final Rule

Do not ask:

> What code can I create?

Ask:

> **What evidence already exists, where does this responsibility currently belong, and what is the smallest missing piece?**

Repository Discovery produces evidence.

It does not produce implementation.
