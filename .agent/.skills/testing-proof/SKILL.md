---
name: testing-proof
description: Testing & Proof
disable-model-invocation: false
---

---

name: testing-and-proof
description: Defines how Botaleb Assistant proves that an implementation is correct, protects existing behavior, and validates important contracts through appropriate automated and manual tests.
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

# Boundary With Implementation Validation

This skill owns **behavioral proof**.

Its question is:

> **Can we demonstrate, with repeatable evidence, that the required behavior works?**

It focuses on executable tests, assertions, test scenarios, regression protection, and observable behavior.

It does **not** own the final implementation review, architecture conformance, requirement coverage, or manual quality gate.

`implementation-validation` owns that broader validation layer.

Typical relationship:

```text
Requirement / Spec
      ↓
Implementation
      ↓
Testing Proof → behavioral evidence
      ↓
Implementation Validation → overall conformance gate
```

Do not turn this skill into a generic code-review checklist.

# Testing & Proof

## Purpose

Testing is not a final checklist.

Testing is the mechanism used to prove that important behavior remains correct after a change.

The agent must distinguish between:

```text
Implementation exists
        ↓
Implementation works in one observed scenario
        ↓
Expected behavior is proven
        ↓
Existing behavior remains protected
```

Only the last two provide meaningful confidence.

---

# Core Mental Model

Before choosing a test, identify the behavior that must remain true.

```text
Requirement
    ↓
Behavior
    ↓
Invariant / Contract
    ↓
Failure Scenario
    ↓
Test Boundary
    ↓
Automated Proof
```

Do not start with:

```text
"What test file should I create?"
```

Start with:

```text
"What must always remain true?"
```

---

# 1. Define the Behavior

For every meaningful change, identify:

* What behavior is being introduced?
* What existing behavior is being changed?
* What behavior must not change?
* What input or action triggers the behavior?
* What output or state transition proves success?
* What failure behavior is expected?

Example:

```text
User edits a Student
        ↓
Submits form
        ↓
Server accepts update
        ↓
Authoritative Student data changes
        ↓
Student list displays updated data
```

The test target is not merely:

```text
"Save button calls service"
```

The important behavior is:

```text
"After a successful update, the authoritative list reflects the saved Student."
```

---

# 2. Identify Invariants

An invariant is a condition that must remain true regardless of how the code reaches that state.

Examples:

```text
A submitted Order must contain at least one line item.

A loading indicator must not remain active after a completed request.

A deleted Student must not remain visible in the authoritative list.

A search result from an older request must not overwrite a newer query result.

A GenericTable action must emit the correct entity to its consumer.
```

The agent should ask:

```text
What would be a clearly invalid state?
What rule must prevent that state?
Who owns enforcement of that rule?
How can we prove it?
```

---

# 3. Test the Invariant, Not the Implementation

Avoid tests that merely prove the current implementation structure.

Weak:

```text
component calls service.getStudents()
```

Stronger:

```text
when the feature loads,
the rendered student list represents the returned students.
```

Weak tests are tightly coupled to implementation details.

Strong tests protect behavior and contracts.

Prefer:

```text
Behavior
```

over:

```text
Internal implementation sequence
```

unless the internal contract itself is important.

---

# 4. Choose the Smallest Effective Test Boundary

Use the smallest boundary that can prove the behavior.

## Pure logic

Use a unit test for:

* mapping
* validation
* calculations
* transformations
* state transitions
* deterministic business rules

Example:

```text
mapStudentToCreateRequest()
```

can usually be tested without Angular.

---

## Component behavior

Test a component when the important behavior is:

* input interpretation
* output events
* UI state transitions
* rendering decisions
* interaction behavior

Example:

```text
StudentFormComponent
    input → form
    submit → studentSubmitted
```

The test should prove the contract.

---

## Feature integration

Use an integration-level test when correctness depends on multiple responsibilities working together.

Example:

```text
Edit Student
    ↓
Form
    ↓
Feature
    ↓
Service
    ↓
Result
    ↓
List State
```

If the bug can happen between these boundaries, a unit test of one function is insufficient.

---

## End-to-End

Use E2E when the behavior depends on the real application boundary:

```text
Browser
    ↓
Routing
    ↓
Feature
    ↓
HTTP
    ↓
Backend
    ↓
Rendered result
```

E2E tests should protect critical user journeys, not every implementation detail.

---

# 5. Test Pyramid as a Cost Model

The test pyramid is not a rule saying:

```text
"Always write lots of unit tests."
```

It is a cost and feedback-speed model.

Generally:

```text
        E2E
       /   \
   Integration
     /       \
   Unit / Pure Logic
```

Lower-level tests should cover deterministic logic cheaply.

Higher-level tests should protect important integration and user behavior.

Do not push every behavior into E2E.

Do not force integration behavior into isolated unit tests when isolation removes the actual risk.

---

# 6. What Should Be Mocked?

Mock a dependency when replacing it allows the test to isolate the behavior under examination.

Do not mock merely because mocking is common.

Ask:

```text
What am I trying to prove?
Which dependency is outside this boundary?
Does mocking remove the behavior I actually need to verify?
```

Example:

If testing a mapping function:

```text
No Angular
No HTTP
No Service
No Mock
```

If testing a feature's response handling:

```text
Feature
    ↓
Mock HTTP/service boundary
    ↓
Real feature behavior
```

If testing the full user journey:

```text
Avoid replacing the entire application with mocks.
```

The test boundary determines what should be real.

---

# 7. Do Not Test the Framework

Do not write tests whose primary purpose is proving that Angular, RxJS, or a third-party library behaves according to its documented contract.

Instead test:

```text
How our application uses the framework.
```

Example:

Do not prove that `FormControl` stores a value.

Prove that:

```text
Invalid student input
    ↓
Feature prevents submission
    ↓
Expected validation feedback is exposed
```

---

# 8. Characterization Tests for Existing Code

When changing legacy behavior, first capture what the current system actually does.

This is a characterization test.

Its purpose is:

```text
Current behavior
        ↓
Test captures behavior
        ↓
Refactor / change
        ↓
Test detects accidental behavior change
```

Characterization tests are especially valuable when:

* documentation is incomplete
* existing behavior is relied upon
* shared code has many consumers
* refactoring legacy code
* behavior is surprising but currently depended upon

Do not automatically preserve a known bug.

Distinguish:

```text
Intentional behavior
```

from:

```text
Accidental behavior
```

If uncertain, stop and clarify rather than encoding an assumption as a permanent contract.

---

# 9. Regression Protection

Every bug fix should answer:

```text
What prevented this bug from being caught?
```

Then add the cheapest reliable regression protection.

Example:

```text
Bug:
Older search response overwrites newer search results.

Regression proof:
Given search A then search B,
when B completes before A,
A must not replace B's result.
```

The test should reproduce the failure condition.

Do not only test the happy path.

---

# 10. Failure Scenarios

For important flows, test at least:

```text
Success
Validation failure
Server failure
Empty result
Loading state
Recovery / retry
```

Not every feature requires every scenario at every test level.

The agent must prioritize scenarios according to risk.

---

# 11. Async Behavior Requires Time-Based Reasoning

For asynchronous code, correctness depends on ordering.

Example:

```text
Request A starts
Request B starts

B completes
    ↓
UI shows B

A completes later
    ↓
Must NOT overwrite B
```

A normal happy-path test may never detect this.

When async operations can overlap, explicitly consider:

* cancellation
* request identity
* ordering
* stale responses
* duplicate submissions
* retries
* cleanup
* destroyed components
* loading state transitions

---

# 12. Mutation Tests

For important tests, verify that the test can actually detect a regression.

Conceptually:

```text
Production behavior
        ↓
Test passes

Introduce controlled defect
        ↓
Test should fail
```

If a meaningful production change does not cause the relevant test to fail, the test may not be proving the intended behavior.

Do not mechanically mutate every line.

Use this as a confidence technique for critical contracts.

---

# 13. Shared Components Require Contract Tests

Shared components have a larger blast radius.

For a shared component such as a GenericTable, protect its public contract:

```text
Input
    ↓
Component
    ↓
Output Event
```

Example contract:

```text
Given an action configured for Student,
when the user triggers Edit,
the component emits the selected Student.
```

The shared component should not be tested for the business meaning of Edit.

That belongs to the feature.

This preserves the boundary:

```text
GenericTable
    owns:
    "an action occurred"

Feature
    owns:
    "Edit means navigate to / open student editing"
```

---

# 14. Test the Feature Contract

For a feature, identify its external contract.

Examples:

```text
Inputs
Outputs
Route parameters
Query parameters
Service interactions
State transitions
Rendered business results
```

Tests should protect these contracts rather than internal variable names.

This also means naming changes should not require test rewrites unless the name itself is part of the contract.

---

# 15. Forms Are Not Domain Truth

A form test should prove form behavior.

It must not be treated as proof that the backend accepts the entity.

Example:

```text
Form validation
        ↓
UI-level protection
```

is different from:

```text
API/business validation
        ↓
Authoritative enforcement
```

Important business rules may require enforcement on the server even if the UI also validates them.

When a rule matters for correctness, test the appropriate enforcement boundary.

---

# 16. Source of Truth After Mutation

CRUD features commonly fail after successful mutations.

Test the complete lifecycle:

```text
Create / Update / Delete
        ↓
Authoritative response
        ↓
State update / refetch / cache update
        ↓
Consumer reads updated state
        ↓
UI reflects authoritative state
```

Do not stop testing at:

```text
POST returned 200
```

A successful HTTP request is not necessarily a successful feature behavior.

---

# 17. Test Data Should Explain the Scenario

Prefer meaningful test data.

Bad:

```ts
foo
bar
123
test
abc
```

Better:

```ts
student
orderWithThreeItems
invalidEmail
emptySearchResult
updatedProduct
```

Test data should make the scenario obvious to the reader.

---

# 18. Test Names Are Specifications

A good test name communicates:

```text
Context
Action
Expected behavior
```

Prefer:

```text
should update the student list after a successful student update
```

over:

```text
should work
```

or:

```text
should call update
```

The test name should tell a future engineer what contract is protected.

---

# 19. Avoid Over-Specified Tests

Do not assert every implementation detail.

If the requirement is:

```text
Updated student appears in the list.
```

do not necessarily assert:

```text
method A called once
method B called once
private property C changed
temporary variable D contains X
```

unless those details are themselves contractual.

Over-specified tests make safe refactoring expensive.

---

# 20. Manual Testing Still Has a Role

Not everything should become an automated test.

Manual verification is appropriate for:

* visual correctness
* responsive behavior
* real browser interaction
* accessibility exploration
* exploratory testing
* complex user experience
* behavior not yet worth automating

But manual verification must be explicitly reported as manual.

Never claim:

```text
Tests passed
```

when only manual browser verification happened.

Say:

```text
Manual verification completed.
Automated tests were not run.
```

---

# 21. Definition of Done

Before declaring a change complete:

```text
1. Identify the changed behavior.
2. Identify important invariants/contracts.
3. Identify failure scenarios.
4. Select the smallest effective test boundary.
5. Add or update automated tests where valuable.
6. Run the relevant tests.
7. Perform manual verification where required.
8. Check regression risk.
9. Report exactly what was validated.
```

---

# 22. Validation Report

The agent must distinguish:

```text
Implemented
Tested
Manually verified
Not verified
```

Example:

```text
Implemented:
- Student update flow

Automated:
- Mapping unit test
- Feature save/list integration test

Manual:
- Edit modal
- Responsive layout

Not verified:
- Full E2E flow
- Production API behavior
```

Never convert assumptions into evidence.

---

# 23. Risk-Based Testing

Testing effort should follow risk.

High-risk changes include:

* shared components
* shared services
* state management
* authentication/authorization
* data mutation
* query engines
* mapping between API and UI
* destructive actions
* concurrency
* changes with many consumers

For high-risk changes, require stronger proof.

A small isolated visual change does not require the same testing depth as a shared state change.

---

# 24. Testing Shared Infrastructure

When changing shared infrastructure:

```text
Identify consumers
        ↓
Identify public contract
        ↓
Protect contract with tests
        ↓
Change implementation
        ↓
Run focused tests
        ↓
Run affected feature tests
        ↓
Run broader regression if risk requires
```

The number of consumers increases the required validation scope.

---

# 25. The Agent Must Not Invent Test Coverage

The agent must never claim:

```text
"Everything is tested."
"Tests pass."
"Regression is covered."
```

unless it actually performed the corresponding validation.

Evidence must determine the statement.

---

# Final Mental Model

Testing is not:

```text
Code
 ↓
Checklist
 ↓
Done
```

Testing is:

```text
Requirement
    ↓
Behavior
    ↓
Invariant / Contract
    ↓
Risk
    ↓
Test Boundary
    ↓
Proof
    ↓
Regression Protection
```

The question is not:

```text
"Did we write tests?"
```

The better question is:

```text
"What evidence do we have that this behavior is correct
and will remain correct after future changes?"
```

---

# Integration With Execution

This skill is consumed by the execution workflow.

The execution agent must invoke this reasoning before declaring completion.

```text
Discover
    ↓
Plan
    ↓
Implement
    ↓
Identify Behavioral Contract
    ↓
Testing & Proof
    ↓
Validate
    ↓
Report Evidence
```

Testing must not become a late checklist added after implementation.

The required proof should influence implementation decisions.

---

# Non-Goals

This skill does not define:

* a specific testing framework
* exact test folder structure
* one mandatory test pyramid ratio
* mandatory E2E coverage
* mocking everything
* testing every line
* testing implementation details

Those decisions depend on the repository and the risk of the change.

The reusable principle is:

> **Choose the smallest reliable evidence that proves the behavior and protects the important contract.**
