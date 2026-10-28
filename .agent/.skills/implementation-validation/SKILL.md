---
name: implementation-validation
description: Provides a validation and quality gate for Botaleb Assistant changes by verifying functional behavior, Angular integration, architecture compliance, scope safety, state flow, and regressions before declaring a task complete.
disable-model-invocation: false
---

# Boundary With Testing Proof

This skill owns the **overall implementation validation gate**.

Its question is:

> **Does the implemented change satisfy the approved requirement/specification and preserve the intended architectural and quality constraints?**

It may inspect:

- requirement/spec coverage
- architecture and responsibility boundaries
- integration behavior
- error and recovery paths
- UX/accessibility requirements when applicable
- available automated proof
- unresolved risks or gaps

It does **not** replace `testing-proof`.

When behavioral proof is required, ask:

> **What executable evidence proves this behavior?**

Then use `testing-proof`.

Typical relationship:

```text
Testing Proof
  = proves specific behavior

Implementation Validation
  = validates the implementation as a whole
```

Validation may identify a missing test, but `testing-proof` owns designing the executable proof.

# Final Gate Contract

This skill is the **final acceptance gate**, not the owner of upstream design decisions.

It consumes approved requirements, architecture decisions, implemented behavior, testing evidence where required, and known risks.

If validation fails, route the finding to its owner instead of silently redesigning: requirement → `spec-kit-pre-implementation`; state → `state-and-data-flow`; domain rule → `domain-invariants`; architecture → `architecture-guardian`; structural evolution → `architecture-evolution`; async → `async-consistency`; runtime → `angular-runtime`; accessibility → `accessibility`; missing executable proof → `testing-proof`.

The loop is: **Finding → Owning Skill → Resolution → Re-validation.**

# Implementation Validation

## Purpose

Validate every implementation before declaring the task complete.

Writing code is not completion.

A task is complete only when:

- the requirement works
- the implementation fits the existing architecture
- Angular integration is correct
- state and data flow are correct
- existing infrastructure was reused correctly
- unrelated code was not broken

Validation must be performed after every meaningful implementation step.

---

# Definition of Done

Do not declare a task complete until all applicable checks have been performed.

A completed task should satisfy:

```text
Requirement
    ↓
Functional Behavior
    ↓
Naming Contract
    ↓
TypeScript Validation
    ↓
Angular Integration
    ↓
State Validation
    ↓
Architecture Validation
    ↓
Scope Validation
    ↓
Regression Check
1. Requirement Validation

Verify the actual user behavior.

Do not validate only that the code exists.

Ask:

What was the requested behavior?
What user action triggers it?
What should happen?
What data should change?
What should the UI display afterward?

Trace the full scenario.

Example:

User clicks Edit
    ↓
Edit modal opens
    ↓
Correct entity data appears
    ↓
User changes data
    ↓
Validation succeeds
    ↓
Save request executes
    ↓
Source of truth updates
    ↓
Updated data appears in UI

A task is not complete because the modal opens.

The complete business flow must work.

2. TypeScript Validation

Verify:

imports are valid
interfaces match usage
property names are correct
method signatures are correct
event payloads match consumers
no unnecessary any types were introduced
generic types are preserved when required
nullable values are handled correctly

Do not ignore type errors.

Do not use:

any

or unsafe casting merely to silence the compiler unless it is unavoidable and justified.

TypeScript errors are implementation errors, not cleanup tasks.

3. Angular Integration Validation

Verify all applicable Angular integration points.

Components
correct selector
correct template path
correct style path
correct inputs
correct outputs
correct event bindings
NgModules

For non-standalone components, verify:

correct declaration
required imports
correct exports if consumed elsewhere

Do not use:

CUSTOM_ELEMENTS_SCHEMA

to hide module or component dependency errors.

Fix the actual integration problem.

Templates

Verify:

bindings match component properties
event handlers exist
control flow is valid
shared component contracts are used correctly
4. Data Flow Validation

Trace the complete flow.

Data Source
    ↓
Service
    ↓
State Owner
    ↓
Component
    ↓
User Interaction
    ↓
Event
    ↓
State Owner
    ↓
Service / State Update
    ↓
Updated UI

Verify that no competing path was accidentally introduced.

Ask:

Is the correct service used?
Is the correct source of truth updated?
Are child components receiving updated data?
Is UI rendering derived from the correct state?
5. State Validation

For every new or modified state, verify:

clear owner
clear lifecycle
correct initialization
correct update flow
correct reset behavior
no competing source of truth

Check for duplicated mutable state.

Example:

Bad:

Service items
+
Component items
+
Modal items

unless each one has a clearly different responsibility.

Prefer:

One authoritative state
    ↓
Derived consumers
6. Shared Infrastructure Validation

Verify that existing reusable infrastructure was used correctly.

Ask:

Was an existing component reused?
Was an existing service reused?
Was generic infrastructure extended only when necessary?
Did feature-specific logic leak into shared code?
Was a duplicate abstraction created?

If a new shared abstraction was created, verify that its responsibility is genuinely generic.

7. Feature Boundary Validation

Verify that the implementation remains inside the correct layer.

Shared Layer
    ↓
Generic responsibility

Core Layer
    ↓
Infrastructure

Feature Layer
    ↓
Business behavior

Do not allow:

Feature business logic
        ↓
Shared component

unless the requirement genuinely belongs to shared infrastructure.

8. Scope Validation

Review every modified and created file.

For each modified file, answer:

Why was this file necessary for the current task?

If the file cannot be directly connected to the requirement, revert the unrelated change.

Do not include:

unrelated cleanup
opportunistic refactoring
unnecessary renaming
formatting changes across unrelated files

Keep the change set minimal.

9. Regression Validation

Before declaring completion, inspect what existing behavior could be affected.

Check:

existing feature flows
shared components
generic infrastructure
consumers of modified contracts
routes
form behavior
query behavior

When modifying shared infrastructure, identify all known consumers.

Do not assume a shared change is isolated.

A generic component change may affect multiple features.

10. Build and Runtime Validation

Run the strongest available validation appropriate to the repository.

Examples:

TypeScript Check
    ↓
Angular Build
    ↓
Relevant Tests
    ↓
Manual Feature Flow

If an automated check cannot be run, do not pretend that it passed.

Explicitly report:

Validated:
- manually inspected X
- TypeScript checked

Not validated:
- full production build was not available
- automated tests were not available

Never claim validation that did not occur.

11. Error Handling Validation

For asynchronous operations, verify the applicable states:

Loading
    ↓
Success
    ↓
Error
    ↓
Recovery

Check that:

loading state does not remain active forever
errors do not silently disappear
UI can recover after failure
successful state updates do not occur before successful operations when inappropriate

Follow existing repository error handling patterns.

12. Query and Table Validation

For features using HybridQueryEngine, verify:

Search
Filter
Sort
Pagination

Trace:

User Action
    ↓
Feature
    ↓
patchQuery()
    ↓
HybridQueryEngine
    ↓
Query Execution
    ↓
Result
    ↓
Generic Table

Verify that the page did not introduce duplicate filtering or sorting logic.

When a query changes, verify whether pagination should reset to the first page.

13. Form Validation

For form-related tasks, verify:

correct form initialization
correct edit data patching
correct validators
valid submission
invalid submission prevention
correct DTO mapping
correct update or create flow

For FormArray:

correct initialization
adding items
removing items
validation
correct submission mapping

Do not validate only the initial form rendering.

Validate the complete lifecycle.

14. Routing Validation

For navigation tasks, verify:

Source Page
    ↓
Navigation
    ↓
Correct URL
    ↓
Route Parameter
    ↓
Target Page
    ↓
Correct Data Load

Verify invalid or missing parameters when relevant.

---

# 15. Template and Styling Quality Gate

This section defines evidence-based checks specific to Angular template
quality and CSS/styling discipline.

**Ground rule:** Do not declare a violation merely because `[class.active]`,
`[ngClass]`, `@if`, `@for`, or a method binding exists. Inspect its actual
complexity and behavior before judging it problematic.

## 15a. Inline Style Check

Ask: Does any template contain `style="..."` attributes or Angular `[style.*]`
bindings for ordinary presentation?

If yes, verify whether the value is a dynamically computed number that
cannot be expressed through a class (the only justified exception).

If no: flag it — move the visual rule to the component stylesheet or shared
styling layer.

*Guidance-only. No automated enforcement is configured.*

## 15b. Template Expression Complexity Check

Ask: Does any template contain:

- Nested ternary expressions?
- Complex compound conditions (`a && b && c === 'd'`) repeated in bindings?
- Business rules or domain decisions embedded in HTML?
- Method calls that perform expensive work or cause side effects on every
  change-detection cycle?

For each found instance, determine whether extracting it to a named
TypeScript property or getter would make the template clearer without
creating unnecessary indirection.

Simple property access, single-level boolean conditions, and single method
calls whose intent is obvious are **not** violations.

*Guidance-only. Angular templates do not have a built-in complexity metric.*

## 15c. Class Binding Complexity Check

Ask: Do any `[class.*]`, `[ngClass]`, or `[class]` bindings:

- Embed a complex condition directly in the binding expression?
- Duplicate the same condition across multiple elements?
- Use a large inline class-map that obscures the component's intent?
- Substitute for a missing component state model?

If yes: derive a clear presentation-state property in TypeScript and let
CSS handle the visual outcome.

If the binding is a simple boolean toggle (`[class.active]="isSelected"`),
it is acceptable as-is.

*Guidance-only. Enforce through code review.*

## 15d. CSS Duplication Check

Ask: Are the same visual rules duplicated across two or more component
stylesheets?

If yes: determine whether a shared utility class, design token, or shared
styling layer already covers the rule. If it does, remove the duplication.
If it does not and the rule is genuinely shared, add it to the established
shared styling layer.

Do not create a new shared abstraction merely because a rule appears twice.
Confirm the sharing intent before extracting.

*Guidance-only. Can be assisted with `grep` across stylesheet files.*

## 15e. Unnecessary Abstraction Check

Ask: Was a new TypeScript property, getter, or service method introduced
solely to satisfy a styling or template rule (i.e., it does not simplify
the template or clarify state)?

If yes: revert the unnecessary indirection. The goal is clarity, not
mechanical compliance with a rule.

## 15f. Visual Regression Check

When styles are moved from inline attributes to stylesheets, or class
bindings are refactored, ask:

- Does the element still render with the intended appearance?
- Does every conditional state (hover, active, loading, error, disabled)
  still appear correctly?
- Did changing a shared class affect unrelated components?

Where practical, inspect the affected component in a running browser.

Report any state that could not be visually verified.

*Guidance-only for routine changes. Add automated snapshot or visual
regression tests only when the project's testing infrastructure supports it.*

---

Validation Report

Before declaring completion, provide a concise report.


Implemented

What behavior was completed?

Reused

What existing infrastructure was reused?

Modified

What existing files changed?

Created

What new files were necessary?

Validated

What was actually checked?

Not Validated

What could not be verified?

Risks or Assumptions

Any remaining uncertainty.

Completion Rule

Do not say:

Done.

unless the complete requested flow has been implemented and validated.

Use:

Implementation complete.

only when:

requirements were addressed
integration was checked
architecture rules were preserved
validation was actually performed
Final Principle

Correct implementation is not:

Code Exists

Correct implementation is:

Requirement Satisfied
        +
Correct Integration
        +
Correct State Flow
        +
Architecture Compliance
        +
No Unnecessary Scope
        +
No Known Regression

The final question before completion is:

Does this change work correctly inside the existing system, or does it only look correct in isolation?
