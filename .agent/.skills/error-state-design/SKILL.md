---
name: error-state-design
description: Design and validate application error states, failure behavior, recovery paths, and user guidance across Angular and Ionic features without conflating error handling with generic UI styling or testing.
---

# Error State Design

## Responsibility

This skill answers:

> **What happens when something goes wrong, and how does the user recover?**

Treat errors as part of the feature's behavior and state model, not as an afterthought.

The goal is not merely to show an error message.

The goal is to define:

```text
Failure Cause
→ Detect
→ Classify
→ Represent
→ Communicate
→ Recover
→ Preserve / Restore Valid State
```

---

## What This Skill Owns

This skill owns:

- Error-state discovery
- Failure classification
- User-facing error states
- Recovery actions
- Retry behavior
- Empty/error/loading state relationships
- Form validation and submission failures
- Network/API failures
- Permission/authentication failures
- Partial-failure behavior
- Stale-data / unavailable-data messaging
- Destructive-action failures
- Error escalation when the user cannot recover
- Preventing dead-end states

It should answer:

- What can fail?
- Where can it fail?
- Who owns the failure state?
- What should the user see?
- What can the user do next?
- What state must remain consistent after failure?
- When should we retry automatically vs ask the user to retry?
- When should the system preserve the previous valid state?

---

## Error Taxonomy

Do not treat every error as the same.

Classify failures according to their meaning and recovery path.

### 1. User Input / Validation Error

The user supplied invalid or incomplete data.

Examples:

- Required field missing
- Invalid format
- Business-rule violation

Recovery:

> Fix the input.

---

### 2. Business Rule Rejection

The request is structurally valid but the business rule rejects it.

Examples:

- Cannot cancel an already completed order
- Duplicate operation
- Action not allowed in current state

Recovery:

> Explain the rule and provide the valid next action.

---

### 3. Authentication / Authorization

The user cannot perform the requested operation.

Examples:

- Session expired
- Insufficient permissions
- Resource access denied

Recovery:

> Re-authenticate, request access, or navigate to an allowed state.

---

### 4. Network / Infrastructure Failure

The client cannot successfully communicate with the required service.

Examples:

- Offline
- Timeout
- Server unavailable
- Connection interrupted

Recovery may include:

- Retry
- Preserve current state
- Continue with cached data when safe
- Explain temporary unavailability

---

### 5. Server / Unexpected Failure

The system cannot complete the operation and the cause is not actionable by the user.

Recovery:

> Preserve consistency, communicate that the operation failed, and provide retry or escalation where appropriate.

Do not expose internal implementation details.

---

### 6. Partial Failure

Only part of a larger operation succeeds.

Examples:

- Batch operation where some items fail
- Dashboard where one widget fails
- Multi-request page where one request fails

The UI must not incorrectly represent the entire operation as successful.

---

## Error State Model

For each important operation, define the state transitions.

Example:

```text
Idle
 ↓
Submitting
 ├── Success → Updated / Success
 ├── Validation Failure → Editable + Field Errors
 ├── Business Failure → Actionable Error
 ├── Auth Failure → Re-auth / Access State
 ├── Network Failure → Retryable Error
 └── Unexpected Failure → Recoverable / Escalated Error
```

Do not collapse all failures into:

```text
loading = false
error = true
```

The recovery path matters.

---

## User-Facing Error Design

Every user-visible error should answer as much as is useful:

1. What happened?
2. Why does it matter?
3. What can I do now?

Prefer actionable communication.

Bad:

> Error 500

Better:

> We couldn't save the changes. Your previous data is still محفوظ. Try again.

Avoid:

- Raw backend messages
- Stack traces
- Internal exception names
- Technical status codes as the primary message
- Blaming the user
- Generic "Something went wrong" when a meaningful explanation is available

---

## Recovery Principles

A good error state should avoid dead ends.

Prefer:

```text
Error
→ Clear next action
→ Preserve safe state
→ Retry / Correct / Navigate
```

Check explicitly:

- Can the user retry?
- Can the user correct the input?
- Is the previous valid state preserved?
- Is duplicate submission prevented?
- Does retry use the correct current data?
- Does the UI recover cleanly after success?
- Does navigation remain possible?

---

## Optimistic / Mutating Operations

For optimistic updates, define rollback behavior explicitly.

```text
Valid State
   ↓
Optimistic Change
   ↓
Request
 ├── Success → Confirm New State
 └── Failure → Roll Back / Reconcile + Explain
```

Never leave the UI showing a state that the server rejected unless that discrepancy is explicitly represented and intentional.

Coordinate with:

- `state-and-data-flow`
- `testing-proof`
- `implementation-validation`

Do not own their responsibilities.

---

## Loading / Empty / Error Distinction

These states are different:

```text
Loading ≠ Empty ≠ Error ≠ No Permission ≠ Offline
```

Examples:

- Loading: data has not arrived yet.
- Empty: request succeeded but there is no data.
- Error: request failed.
- No Permission: request is not allowed.
- Offline: connectivity prevents the operation.

Do not use an empty state to hide an error.

---

## Error Ownership

Identify the narrowest owner that has enough context to decide the recovery behavior.

Examples:

- Field validation → form/control
- Feature business rejection → feature/application layer
- API mapping → data/API boundary
- Global authentication expiry → auth infrastructure
- Global unexpected failure reporting → application infrastructure

Do not push every error into a global service merely because it is convenient.

---

## Stop Conditions

Stop and ask for clarification when:

- The business recovery rule is unknown.
- It is unclear whether an operation is retryable.
- Failure can leave data inconsistent and rollback/reconciliation is undefined.
- Different layers disagree about who owns the error.
- The backend contract does not provide enough information to distinguish important failure types.
- A destructive action has no defined failure behavior.

Do not invent recovery behavior for critical business operations.

---

## Output

For each important operation, produce:

```text
Operation:
...

Failure:
...

Category:
...

User State:
...

User Message:
...

Recovery Action:
...

State Consistency:
...

Owner:
...

Retry Policy:
...

Open Question:
...
```

The output should be concise enough to feed into the implementation plan and test design.

---

## Relationship With Other Skills

- `spec-kit-pre-implementation` owns the pre-implementation workflow.
- `repository-discovery` provides repository evidence.
- `architecture-guardian` decides architectural changes.
- `state-and-data-flow` owns state ownership and data flow.
- `error-state-design` defines failure states and recovery behavior.
- `testing-proof` proves important failure behavior through executable tests.
- `implementation-validation` validates that the implemented feature satisfies the approved error behavior.
- UI analysis/implementation skills decide the visual presentation of the error state.

Do not duplicate these skills.

---

## Core Principle

> **An error state is not the absence of success. It is a defined system state with a defined recovery path.**
