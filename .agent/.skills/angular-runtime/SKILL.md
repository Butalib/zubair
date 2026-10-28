---
name: angular-runtime
description: Reason about Angular runtime behavior including Signals, RxJS, change detection, dependency injection, lifecycle, rendering, effects, subscriptions, and Ionic view lifecycle differences before implementation.
disable-model-invocation: false
---

# Angular Runtime

## Purpose

Understand what the Angular runtime will actually do when state, dependencies, subscriptions, lifecycle hooks, and rendering interact.

This skill answers:

> **When this code runs, what owns the state, when does it run, when does the view update, and what runtime mechanism causes that behavior?**

This is a runtime reasoning skill, not an Angular syntax tutorial.

---

# Ownership Boundary

`state-and-data-flow` answers **who owns state, what it means, who may change it, and where the source of truth lives**.

`angular-runtime` answers **when Angular/Ionic executes, what triggers reactive/lifecycle behavior, when rendering occurs, and when cleanup happens**.

If runtime evidence exposes unclear ownership: **STOP → resolve ownership in `state-and-data-flow` → resume runtime reasoning.**

# 1. Runtime Model First

Before changing code, identify:

```text
Trigger
→ Runtime Mechanism
→ State Change
→ Rendering / Side Effect
→ Lifecycle
→ Cleanup
```

Ask:

- What starts the operation?
- Which runtime mechanism observes it?
- Where is state stored?
- What causes the view to update?
- What causes the effect/subscription to run?
- When is it cleaned up?

Do not explain behavior only from the source code shape.

---

# 2. Angular Lifecycle

Understand the lifecycle relevant to the operation:

```text
Construction
→ Input Initialization
→ Change Detection
→ After View / Content Initialization
→ Repeated Change Detection
→ Destruction
```

Use lifecycle hooks according to their actual semantic responsibility.

Do not use a lifecycle hook merely because it happens to "work."

Before using a hook, ask:

```text
Why does this work belong to this lifecycle phase?
What guarantees exist at this point?
What happens if the component is recreated?
What happens if it is not recreated?
```

---

# 3. Ionic View Lifecycle

Ionic applications introduce a second lifecycle concept.

A routed Ionic page can remain mounted while its view leaves and re-enters the visible navigation stack.

Distinguish Angular lifecycle from Ionic view lifecycle.

Important Ionic page events include:

```text
ionViewWillEnter
ionViewDidEnter
ionViewWillLeave
ionViewDidLeave
```

Do not assume:

```text
ionViewWillEnter
=
ngOnInit
```

or:

```text
ionViewDidEnter
=
component creation
```

They have different semantics.

When working inside Ionic navigation, explicitly determine:

```text
Angular Component Lifecycle
+
Ionic View Lifecycle
+
Router Navigation Lifecycle
```

before placing initialization, refresh, cleanup, or UI synchronization logic.

---

# 4. Page Re-entry and Cached Views

Ionic navigation may keep a page instance alive.

Therefore:

```text
Navigate Away
≠
Component Destroyed
```

and:

```text
Navigate Back
≠
Component Recreated
```

This affects:

- subscriptions
- timers
- local state
- cached data
- refresh logic
- form state
- initialization code
- cleanup

If a page must refresh whenever it becomes visible, do not automatically put the logic in `ngOnInit`.

Choose the lifecycle based on the intended behavior.

---

# 5. Signals

For Signals, reason about:

```text
Signal
→ Read
→ Dependency Tracking
→ Consumer
→ Recalculation / Rendering
```

Distinguish:

- writable signal
- computed signal
- effect
- template consumption

Important questions:

- Is the signal actually read by the consumer?
- Is the computed value derived from the correct dependencies?
- Is an effect being used for synchronization or merely because it is convenient?
- Could the effect create a feedback loop?
- Is derived state being stored unnecessarily?

Prefer:

```text
Source State
→ computed
```

for pure derivation.

Use:

```text
effect
```

for legitimate side effects/synchronization, not as a replacement for normal state derivation.

---

# 6. RxJS

Reason about Observable execution explicitly.

Distinguish:

```text
Cold vs Hot
Unicast vs Multicast
Subscription time
Emission time
Completion
Error
Unsubscription
```

For every important stream ask:

- Who subscribes?
- When does execution start?
- Can there be multiple subscriptions?
- Does each subscription trigger work again?
- Who owns the subscription lifetime?
- What happens on error?
- What happens after completion?

Do not assume an Observable is "already running."

---

# 7. RxJS + Signals Boundary

When Signals and RxJS coexist, make the boundary explicit.

Ask:

```text
Which system owns the state?
What crosses the boundary?
Why is the boundary needed?
```

Avoid unnecessary conversions.

Do not introduce:

```text
Observable
→ Signal
→ Observable
```

without a concrete runtime reason.

Keep reactive models independent when that is simpler.

Coordinate async correctness with:

`async-consistency`

---

# 8. Change Detection

Do not reason about rendering as:

```text
state changed
→ Angular always rerenders everything
```

Instead identify:

- what changed
- who observes it
- which component/template consumes it
- what change-detection mechanism is relevant
- whether the update occurs inside or outside the expected Angular execution context

For performance-sensitive paths, distinguish:

```text
State update
vs
Change detection
vs
DOM update
```

They are related but not identical.

---

# 9. Effects and Side Effects

For every effect, identify:

```text
Triggering Dependencies:
...

Side Effect:
...

External Target:
...

Cleanup:
...

Could It Re-trigger Itself:
...

Could It Run More Than Expected:
...
```

Common side effects:

- API calls
- navigation
- local storage
- analytics
- DOM interaction
- external integrations

Do not use effects to patch architectural problems.

---

# 10. Dependency Injection

Reason about:

- provider scope
- service lifetime
- singleton assumptions
- feature/module providers
- component-level providers
- injection context

Ask:

```text
Who owns this service instance?
How many instances can exist?
When is the instance created?
When does it disappear?
```

A service's behavior can change significantly depending on provider scope.

---

# 11. Subscription and Cleanup

For every long-lived subscription determine:

```text
Owner:
...

Lifetime:
...

Cleanup:
...

Can It Outlive The View:
Yes | No

Duplicate Subscription Risk:
...
```

Use Angular/RxJS lifecycle-aware mechanisms where appropriate.

Do not add manual cleanup mechanically when the framework already provides a safe ownership mechanism.

---

# 12. Async + Runtime

Coordinate runtime reasoning with:

`async-consistency`.

Runtime questions:

> When does the operation execute?

Consistency questions:

> Which result is allowed to update state?

Both are required for correct async behavior.

Example:

```text
Ionic Page Re-enters
→ Request starts
→ User leaves
→ Page remains mounted
→ Response arrives
```

The runtime model determines whether the subscription still exists.

The consistency model determines whether that response is still allowed to update the current state.

---

# 13. UI Runtime State

For important UI state, distinguish:

```text
Source State
Derived State
Transient UI State
Async State
Persisted State
```

Avoid storing the same fact in multiple reactive systems unless synchronization is explicit.

Example:

```text
isLoading
```

should have one clear owner rather than independent values in:

- component field
- signal
- BehaviorSubject
- service cache

unless there is a deliberate synchronization contract.

---

# 14. Ionic-Specific Runtime Checklist

For an Ionic page, explicitly ask:

```text
Is the page cached?
Which Ionic lifecycle event represents the desired moment?
Does ngOnInit run only once for this instance?
Should data refresh on every ionViewWillEnter?
Should cleanup happen on ionViewDidLeave or destruction?
Can navigation trigger overlapping requests?
Can an old page response update current state?
Are overlays/modals/popovers using their own lifecycle?
```

Do not assume web Angular lifecycle behavior maps one-to-one onto Ionic navigation behavior.

---

# 15. Common Runtime Failure Patterns

Watch for:

### Duplicate Initialization

```text
ngOnInit
+
ionViewWillEnter
→ duplicate request
```

### Stale Page State

```text
Page leaves
→ instance remains
→ state stays alive
→ page re-enters with old state
```

### Leaked Subscription

```text
Page leaves
→ subscription remains
→ emissions continue
```

### Repeated Effect

```text
effect
→ state mutation
→ dependency changes
→ effect
→ repeated side effect
```

### Duplicate Observable Execution

```text
Two subscriptions
→ two executions
→ duplicate API calls
```

### Incorrect Runtime Assumption

```text
"Component disappeared"
```

when the component was only removed from the visible navigation stack.

---

# 16. Stop Conditions

Stop and inspect runtime behavior when:

- lifecycle ownership is unclear
- Angular and Ionic lifecycle events are both involved
- a subscription may outlive the intended view
- an effect changes one of its own dependencies
- multiple subscriptions may trigger duplicated work
- provider scope is ambiguous
- rendering behavior is being explained without identifying the actual reactive consumer
- a page is assumed destroyed when Ionic may cache it

Do not guess runtime behavior from naming alone.

---

# 17. Output

Produce:

```text
Runtime Trigger:
...

Angular Lifecycle:
...

Ionic Lifecycle:
...

State Owner:
...

Reactive Mechanism:
Signal | Observable | Subject | Other

Execution Timing:
...

Rendering Mechanism:
...

Subscription Lifetime:
...

DI Scope:
...

Cleanup:
...

Duplicate Execution Risk:
...

Stale State Risk:
...

Open Questions:
...
```

---

# Relationship With Other Skills

- `spec-kit-pre-implementation` owns the workflow.
- `repository-discovery` provides existing Angular/Ionic runtime patterns.
- `state-and-data-flow` owns state ownership and data movement.
- `async-consistency` owns temporal correctness and concurrent async operations.
- `angular-runtime` owns Angular/Ionic runtime semantics.
- `error-state-design` owns failure/recovery behavior.
- `testing-proof` proves runtime-sensitive behavior.
- `implementation-validation` validates implementation against runtime expectations.
- `ui-ux-design-analysis` describes UI behavior but does not own Angular runtime mechanics.

Do not turn this skill into a generic Angular feature implementation skill.

---

## Core Principle

> **Never infer Angular/Ionic runtime behavior from method names alone; reason from lifecycle, ownership, subscription, dependency, and rendering semantics.**
