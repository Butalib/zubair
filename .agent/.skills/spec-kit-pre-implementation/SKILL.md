---
name: spec-kit-pre-implementation
description: Orchestrate the pre-implementation Spec-Driven Development flow using GitHub Spec Kit artifacts and quality gates, stopping before implementation.
disable-model-invocation: false
---

# Spec Kit — Pre-Implementation

## Responsibility

This skill owns **only the workflow from an approved feature request up to the implementation gate**.

It does not implement code.

It does not replace technology-specific skills.

It does not replace repository discovery or architecture decisions.

Its job is to make sure implementation starts from coherent, reviewed artifacts.

---

# Workflow Boundary

This skill covers:

```text
Constitution
    ↓
Specify
    ↓
Clarify
    ↓
Plan
    ↓
Checklist
    ↓
Tasks
    ↓
Analyze
    ↓
🛑 IMPLEMENTATION GATE
```

It stops before:

```text
/speckit.implement
```

Post-implementation work such as `converge` belongs to the execution/review phase, not this skill.

---

# Execution Protocol

This skill is the **pre-implementation orchestrator**, not the owner of every engineering decision.

Use this protocol to determine when other skills must be invoked and when implementation may start.

```text
Request
  ↓
Repository / Project Context
  ↓
Spec Kit artifacts
  ↓
Domain Invariants
  ↓
Architecture / Ownership decisions
  ↓
State / Data / Async / Error / UI design as applicable
  ↓
🛑 GATE 1 — Decision Completeness
  ↓
Implementation
  ↓
Runtime / Coupling / Naming / Accessibility constraints during implementation
  ↓
Testing Proof
  ↓
Implementation Validation
  ↓
🛑 GATE 2 — Completion
```

## Skill Invocation Rules

- Invoke only the skills relevant to the change.
- Do not start implementation while an applicable decision remains unresolved.
- `repository-discovery` and project context establish evidence.
- `domain-invariants`, `shared-vs-feature-specific`, `architecture-guardian`, `state-and-data-flow`, `async-consistency`, `error-state-design`, and `ui-ux-design-analysis` are invoked as applicable before implementation.
- `code-naming-conventions`, `angular-runtime`, `coupling-cohesion`, and `accessibility` are cross-cutting constraints during implementation, not sequential stages.
- `testing-proof` owns executable behavioral evidence.
- `implementation-validation` owns the final acceptance gate.
- `architecture-evolution` is an exception path only when smaller changes are insufficient.

## 🚨 Data Completeness Gate — Runs Before Gate 1

**This is the most commonly violated rule. Read it before writing a single line of code.**

Before implementing any UI element that displays, labels, or describes data to the user, verify the TypeScript interface provides every required field.

### Required Fields Check

For every UI element, ask:

```text
Does this element need a visible label, heading, or title?
  → Is there a `title: string` (or equivalent) on the interface? YES / NO

Does this element need an alt text for an image?
  → Is there a `altText: string` or `name: string` on the interface? YES / NO

Does this element need an aria-label for assistive technology?
  → Is there a dedicated field (title/label/name) to bind it from? YES / NO

Does this element need a descriptive route or link label?
  → Is there a `title` or `label` on the interface? YES / NO
```

### If ANY answer is NO → HARD STOP

```text
🛑 MISSING DATA FIELD

Do NOT:
  ❌ Fabricate: aria-label="'عنصر ' + (i + 1)"
  ❌ Fabricate: alt="'صورة رقم ' + (i + 1)"
  ❌ Fabricate: aria-label="'مجموعة ' + (i + 1)"
  ❌ Use positional index math to create human-readable labels
  ❌ Use placeholder strings like "Item", "Card", "Image"

DO:
  ✅ STOP implementation
  ✅ Surface the missing field to the user
  ✅ Add the field to the TypeScript interface (e.g., title: string)
  ✅ Ask the user for real data values
  ✅ Only then proceed with implementation
```

### Why This Matters

Fabricated labels (`'عنصر ' + (i+1)`) are not meaningful — they reveal the implementation, not the content. Screen reader users and search engines get useless information. This is not a minor accessibility issue; it is a fundamental data modeling failure.

The correct fix is always at the **interface level** before the **template level**.

### Example: Wrong vs. Right

```typescript
// ❌ WRONG — interface has no title, agent fabricates in template
interface HeroSlide { image: string; link: string; }
// Template: [attr.aria-label]="'عرض مجموعة زبير ' + (i + 1)"

// ✅ RIGHT — interface owns the data, template binds to it
interface HeroSlide { image: string; link: string; title: string; }
// Template: [attr.aria-label]="slide.title"
```

---

## Gate 1 — Decision Completeness

STOP before implementation if an applicable item is unresolved:

```text
Requirement / scope
Feature boundary
Responsibility ownership
State ownership
Domain invariants
Dependency direction
Async consistency
Error/recovery behavior
UI interaction/state behavior
UI data completeness (see Data Completeness Gate above)
```

Do not invent architecture during implementation to compensate for missing decisions.

Do not invent data during implementation to compensate for missing interface fields.

## Gate 2 — Completion

Completion requires:

```text
Approved requirement satisfied
+ Architecture preserved or intentionally evolved
+ Relevant runtime behavior validated
+ Relevant async/error behavior validated
+ Executable proof available where required
+ Implementation validation passed
```

## Loop-Back Rule

When a later stage discovers a problem:

```text
Problem → identify owning decision → invoke owning skill → resolve → return to nearest affected gate
```

Do not restart the entire workflow unless the requirement or architectural direction materially changed.

## Hard Stop

If the agent cannot identify the owner of a decision, **STOP** and resolve ownership before implementation.

# Spec Kit Is The Workflow

Do not create a parallel local workflow such as:

```text
Understand
→ Analyze
→ Plan
→ Execute
```

when Spec Kit is available.

Use the project's Spec Kit commands/artifacts as the workflow contract.

Canonical command sequence:

```text
/speckit.constitution
/speckit.specify
/speckit.clarify
/speckit.plan
/speckit.checklist
/speckit.tasks
/speckit.analyze
```

Not every step is mandatory for every task.

The required minimum for a normal feature is determined by the project's Spec Kit setup. Use the quality gates proportionally to ambiguity and risk.

---

# Responsibility Of Each Stage

## Constitution

Purpose:

```text
Project principles and governing constraints
```

Use it to understand existing project-level rules.

Do not rewrite the constitution for a normal feature.

Only change it when project principles genuinely need to change.

---

## Specify

Purpose:

```text
What is being built?
Why does it exist?
What should the user experience?
```

Focus on:

- user value
- behavior
- requirements
- user stories
- acceptance-oriented outcomes

Do not inject implementation details into the specification unless they are actual requirements.

Technology choices belong in planning.

---

## Clarify

Purpose:

```text
Remove ambiguity before technical planning.
```

Ask targeted questions about:

- missing business behavior
- ambiguous states
- permissions
- edge cases
- failure behavior
- conflicting requirements
- unclear user expectations

Prefer a small number of high-value questions.

Do not ask questions whose answers can be established from the repository.

Do not invent business decisions.

If ambiguity affects correctness, stop and resolve it.

---

## Plan

Purpose:

```text
How will the approved specification fit the technology and architecture?
```

This is where technology-specific reasoning enters.

Before planning, use:

```text
repository-discovery
```

to establish repository evidence.

Use:

```text
architecture-guardian
```

to decide reuse / extension / feature-specific ownership / architectural change when required.

For Angular projects, use the relevant Angular skills.

For Ionic projects, use Angular + Ionic skills.

Do not duplicate their knowledge inside this workflow skill.

The plan should consume those decisions rather than redefine them.

---

## Checklist

Purpose:

```text
Validate requirement quality before implementation.
```

Treat the checklist as a requirements-quality gate.

Check for:

- missing behavior
- ambiguous requirements
- missing edge cases
- inconsistent acceptance criteria
- missing failure behavior
- undefined user flows
- contradictions

A custom checklist is a review artifact.

Do not silently mark reviewer-owned checklist items as approved.

---

## Tasks

Purpose:

```text
Convert the approved plan into actionable, dependency-aware work.
```

Tasks should reflect the approved plan.

Do not introduce architectural decisions inside task generation.

A task that requires a new architectural decision is a signal to return to planning.

Tasks should make implementation scope visible.

Prefer task boundaries that are small enough to implement and validate without unnecessarily expanding context.

---

## Analyze

Purpose:

```text
Check consistency across specification, plan, and tasks before implementation.
```

Run the read-only consistency analysis.

Look for:

```text
Requirement
    ↕
Plan
    ↕
Tasks
```

Detect:

- requirements with no implementation path
- tasks with no requirement
- plan decisions contradicting the specification
- missing dependencies
- unresolved ambiguity
- inconsistent terminology
- scope drift

If analysis finds a problem, fix the artifact at the layer that owns the problem.

Do not patch contradictions by jumping directly into code.

---

# Artifact Ownership

Use this ownership model:

```text
spec.md
    → What / Why

clarifications
    → Resolve ambiguity

plan.md
    → How / Architecture / Technology

checklists
    → Requirement-quality proof

tasks.md
    → What implementation work must happen

Code
    → Implementation
```

Do not place the same decision in multiple artifacts unless the duplication is required by the artifact contract.

---

# Skill Integration

This skill orchestrates other skills; it does not absorb them.

Typical feature flow:

```text
Spec Kit
   ↓
Specify
   ↓
Clarify
   ↓
Repository Discovery
   ↓
Architecture Guardian
   ↓
Technology Skills
   ↓
Plan
   ↓
Checklist
   ↓
Tasks
   ↓
Analyze
   ↓
🛑 STOP
```

The exact ordering may vary when repository evidence is needed earlier.

The responsibility boundaries remain unchanged.

---

# Stop Before Implementation

When the pre-implementation artifacts are coherent:

```text
🛑 IMPLEMENTATION GATE

Specification:
✓

Clarifications:
✓

Repository evidence:
✓

Architecture decision:
✓ / Not required

Technical plan:
✓

Requirements checklist:
✓ Reviewed

Tasks:
✓

Cross-artifact analysis:
✓ Clean

Implementation may begin.
```

**Do not start implementation automatically.**

This skill ends at the gate.

---

# When To Loop Back

Use the artifact that owns the problem.

```text
Requirement ambiguity
    → specify / clarify

Architecture or technology problem
    → plan

Requirement-quality gap
    → checklist / clarify / specify

Missing or incorrect task
    → tasks / plan

Cross-artifact contradiction
    → return to the owning artifact
```

Do not fix a planning problem inside `tasks.md`.

Do not fix a requirement problem inside Angular code.

Do not fix an architecture problem by adding an arbitrary task.

---

# Context Protection

Keep the working context proportional.

Do not load every skill or every repository artifact into every stage.

Use:

```text
Current requirement
+
Relevant artifact
+
Relevant repository evidence
+
Relevant technology skill
```

Avoid:

```text
Entire repository
+
All track skills
+
All historical specs
+
All unrelated project context
```

For large features, preserve context by processing the feature through bounded artifacts and phases.

---

# Technology Track Boundary

For an Angular Web project:

```text
Spec Kit
+
Angular Skills
+
Web UI Skills when needed
```

For an Ionic Angular mobile project:

```text
Spec Kit
+
Angular Skills
+
Ionic Skills
+
Mobile UI Skills when needed
```

Do not load Flutter, Backend, or unrelated technology skills into these projects.

---

# Non-Goals

This skill does not:

- write application code
- choose Angular APIs by itself
- define business invariants
- own repository discovery
- own architecture decisions
- define test implementation details
- perform post-implementation convergence

Those responsibilities belong to specialized skills.

---

# Final Rule

The goal of this skill is not:

```text
Make the agent think harder.
```

The goal is:

```text
Turn an idea into coherent,
reviewable,
implementation-ready artifacts
before code execution begins.
```

When the artifacts are not coherent:

```text
STOP
→ return to the artifact that owns the problem
→ resolve it
→ analyze again
```

When they are coherent:

```text
STOP
→ implementation gate
→ another skill/process may execute the approved tasks
```
