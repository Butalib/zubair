---
name: async-consistency
description: Analyze asynchronous operations for races, stale responses, cancellation, duplicate requests, optimistic updates, cache invalidation, and state consistency across Angular and application features.
disable-model-invocation: false
---

# Async Consistency

## Purpose

Design asynchronous flows so that delayed, concurrent, duplicated, cancelled, or failed operations cannot leave the application in an incorrect state.

This skill answers:

> **When multiple asynchronous operations overlap or complete at different times, which result is authoritative and what state should the application expose?**

This is about **temporal correctness**, not merely making HTTP requests work.

---

# 1. Model the Async Operation

For each important async flow, identify:

```text
Trigger:
...

Operation:
...

Source:
...

Target State:
...

Owner:
...

Expected Completion:
...

Failure Behavior:
...
```

Examples:

- search
- filtering
- route-driven loading
- save/update
- delete
- login
- refresh token
- optimistic mutation
- pagination
- autocomplete

---

# 2. Identify Concurrency

Ask:

> Can this operation start again before the previous operation finishes?

If yes, classify the concurrency.

Common cases:

```text
A → A
Repeated same request

A → B
New request supersedes old request

A + B
Both operations remain relevant

A → Cancel
Previous operation is no longer relevant
```

Do not assume every async operation should behave the same way.

---

# 3. Race Conditions

A race exists when completion order can differ from initiation order and that difference can corrupt the intended state.

Example:

```text
Request A starts
Request B starts

B completes
→ state = B

A completes later
→ state = A   ❌ stale overwrite
```

Determine:

```text
Can responses arrive out of order?
Can an older response overwrite newer state?
What makes a response authoritative?
```

---

# 4. Stale Response Protection

Choose an explicit strategy when operations can become obsolete.

Possible strategies:

- cancellation
- switch-to-latest semantics
- request identity/version
- sequence number
- timestamp/version comparison
- server version / ETag
- ignore obsolete responses
- state reconciliation

Do not use timestamps or request IDs blindly.

The strategy must match the business semantics.

---

# 5. Cancellation

Cancellation means:

> The result of this operation is no longer relevant.

Examples:

- user changed search term
- route changed
- component destroyed
- user started a newer request
- operation was explicitly cancelled

Define:

```text
Cancellation Trigger:
...

What Gets Cancelled:
...

What State Remains:
...

Can Cancellation Cause Error UI:
Yes | No

Why:
...
```

Cancellation should not automatically be treated as a failure.

---

# 6. Duplicate Requests

Identify accidental duplication:

```text
Same trigger
→ same operation
→ multiple in-flight requests
```

Possible causes:

- repeated subscriptions
- lifecycle hooks
- multiple consumers
- double-click
- repeated route events
- retry logic
- cache misses

Decide whether duplication should be:

```text
Prevented
Deduplicated
Allowed
Merged
Queued
```

Do not introduce request deduplication if independent operations are actually valid.

---

# 7. Search / Query Flows

For user-driven queries:

```text
Input
→ Query
→ Response
→ Display
```

Define:

- debounce requirement
- cancellation strategy
- stale response strategy
- loading behavior
- empty result behavior
- error behavior
- pagination consistency
- filter/sort consistency

Example:

```text
"ang"
  ↓
request A

"angu"
  ↓
request B

"angular"
  ↓
request C

Only C should update the current search result
```

when latest-query semantics apply.

---

# 8. Concurrent Mutations

For mutations, identify whether operations can overlap.

Examples:

```text
Update A
Update B

Delete
Update

Accept
Reject
```

Determine:

- ordering requirement
- conflict behavior
- server authority
- client reconciliation
- duplicate prevention
- rollback behavior

Never assume "last response wins" is correct.

---

# 9. Optimistic Updates

For optimistic state:

```text
Current State
   ↓
Optimistic State
   ↓
Server Operation
```

Define:

### Success

```text
Optimistic State
→ Confirm / Reconcile
```

### Failure

```text
Optimistic State
→ Rollback / Reconcile
→ Error State
```

### Concurrent Mutation

Define how multiple optimistic changes interact.

Avoid naïve rollback such as:

```text
set state back to previousSnapshot
```

when another valid mutation happened after that snapshot.

Coordinate failure UX with:

`error-state-design`

and domain correctness with:

`domain-invariants`.

---

# 10. Cache Consistency

When cached state exists, identify:

```text
Source of Truth:
...

Cache:
...

When Cache Becomes Stale:
...

Invalidation Trigger:
...

Refresh Trigger:
...

Mutation Update Strategy:
...

Conflict Resolution:
...
```

Possible strategies:

- invalidate and refetch
- update cache directly
- optimistic cache update
- stale-while-revalidate
- version-based reconciliation

Do not add cache invalidation everywhere by default.

---

# 11. Request Lifecycle

Model the important states:

```text
Idle
 ↓
Requested
 ↓
In Flight
 ├── Success
 ├── Failure
 └── Cancelled / Obsolete
```

For mutations:

```text
Idle
 ↓
Pending
 ↓
Optimistic / Submitted
 ├── Confirmed
 ├── Rejected
 ├── Failed
 └── Superseded
```

Avoid boolean-only models when they cannot distinguish important states.

---

# 12. Source of Truth

Every async flow should have a clear authority.

Possible authorities:

- local feature state
- shared client cache
- server response
- server version
- database transaction
- domain state

Ask:

> Which value wins when two sources disagree?

Never leave this implicit for critical state.

---

# 13. Consistency Strategy

Classify the required consistency:

```text
Strong / immediate consistency
Eventual consistency
Best-effort UI consistency
```

Use the weakest consistency model that safely satisfies the requirement.

Do not claim strong consistency when the client only performs optimistic updates.

---

# 14. Retry

Retry only when the operation is meaningfully retryable.

Define:

```text
Retryable:
Yes | No

Reason:
...

Automatic Retry:
Yes | No

Maximum Attempts:
...

Backoff:
...

Idempotency Requirement:
...
```

Do not blindly retry:

- non-idempotent mutations
- business-rule rejections
- authorization failures
- invalid input

Coordinate failure UX with `error-state-design`.

---

# 15. Idempotency

For operations that may be repeated, ask:

> If this request executes twice, can it safely produce the same intended result?

If not, identify the required protection:

- idempotency key
- request deduplication
- server-side uniqueness
- transactional constraint
- client-side duplicate prevention

Client-side prevention alone is not sufficient for critical server-side guarantees.

---

# 16. Async + Domain Invariants

If an invariant depends on current state, consider stale reads.

Example:

```text
Read capacity = 1

Request A sees capacity = 1
Request B sees capacity = 1

Both attempt reservation
```

The client cannot safely enforce the invariant through a stale snapshot alone.

Flag:

```text
Concurrency-sensitive invariant:
Yes

Authoritative enforcement:
...
```

Coordinate with:

`domain-invariants`

and `architecture-guardian`.

---

# 17. Stop Conditions

Stop and ask for clarification when:

- the authoritative source is unknown
- concurrent operations have conflicting semantics
- stale data can violate a critical invariant
- rollback behavior is undefined
- retry safety is unknown
- mutation ordering matters but is unspecified
- cache ownership is unclear
- cancellation could change business meaning

Do not guess the consistency model.

---

# 18. Output

Produce:

```text
Async Flow:
...

Trigger:
...

Concurrency Model:
...

Race Risk:
...

Stale Response Risk:
...

Cancellation:
...

Duplicate Request Policy:
...

Source of Truth:
...

Cache Strategy:
...

Mutation Strategy:
...

Retry Policy:
...

Consistency Requirement:
...

Idempotency:
...

Failure / Recovery:
...

Open Questions:
...
```

---

# Relationship With Other Skills

- `spec-kit-pre-implementation` owns the pre-implementation workflow.
- `repository-discovery` supplies existing async patterns and infrastructure.
- `domain-invariants` owns business invariants and legal state transitions.
- `state-and-data-flow` owns state ownership and data movement.
- `async-consistency` owns temporal correctness and overlapping async operations.
- `error-state-design` owns user-facing failure and recovery behavior.
- `architecture-guardian` decides architectural changes needed to support the consistency model.
- `testing-proof` proves race, cancellation, retry, and consistency behavior.
- `implementation-validation` validates the resulting implementation.

Do not turn this skill into a generic RxJS tutorial.

---

## Core Principle

> **Async correctness is not "the request eventually returned"; it is exposing the correct state when requests overlap, finish out of order, fail, or become obsolete.**
