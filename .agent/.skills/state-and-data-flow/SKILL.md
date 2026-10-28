---
name: state-and-data-flow
description: Defines state ownership and data flow rules for Botaleb Assistant, ensuring that server data, feature state, query state, form state, and UI state have clear owners and do not create competing sources of truth.
disable-model-invocation: false
---

# State and Data Flow

## Purpose

Ensure that every important piece of state has a clear owner, lifecycle, and data flow.

The goal is to prevent:

- competing sources of truth
- duplicated state
- hidden state updates
- components owning state they should only display
- shared components owning feature business state
- services and components independently managing the same data

Before implementing any stateful behavior, identify:

- what the state represents
- who owns it
- who can update it
- who consumes it
- how long it should live
- where the source of truth is

---

# Boundary With Runtime

This skill owns **state meaning, ownership, lifecycle, and data movement**. It does not own Angular/Ionic execution semantics.

Example: `OrdersService` being the source of truth is a state decision; refreshing a reused Ionic page on re-entry is a runtime decision.

When framework timing affects a state question, resolve ownership here first, then resolve execution timing in `angular-runtime`.

# Core Principle

Every state must have one clear owner.

Do not ask:

> Where is it convenient to store this value?

Ask:

> Which layer owns the meaning and lifecycle of this state?

---

# State Categories

Classify state before implementing it.

The main categories are:

1. Server Data
2. Feature State
3. Query State
4. Form State
5. UI State
6. Temporary Interaction State

Do not treat all state as the same.

Each category has different ownership and lifecycle.

---

# 1. Server Data

Server data represents entities loaded from or persisted to the backend.

Examples:

- students
- orders
- users
- products
- conversations
- messages

The data layer is responsible for communicating with the server.

When GenericCrudService or an existing feature service owns the data:

```text
API
  ↓
Service
  ↓
Source of Truth
  ↓
Feature Consumers

Do not create unnecessary copies of server data.

Do not allow multiple unrelated services to independently become the source of truth for the same entity collection.

Source of Truth

For every important server state, identify the authoritative owner.

Example:

OrdersService
    ↓
Orders State
    ↓
Orders Page
    ↓
Orders UI

Avoid:

OrdersService
    ↓
Orders Array A

Component
    ↓
Orders Array B

Modal
    ↓
Orders Array C

Multiple copies create synchronization problems.

If a derived local value is needed, clearly identify it as derived state rather than a second source of truth.

2. Feature State

Feature state represents the current business context of a feature.

Examples:

selected order
selected student
active conversation
current product type
selected tab

Feature state is usually owned by:

Feature Page
or
Feature Container

Example:

Conversations Page
    ↓
selectedConversation
    ↓
Chat Component

The presentation component receives the selected entity.

The feature owner decides when the selection changes.

3. Query State

Query state describes how data should be queried or presented.

Examples:

search term
filters
sorting
current page
page size

When HybridQueryEngine is used, it owns query state.

Expected flow:

User Action
    ↓
Feature Page
    ↓
patchQuery()
    ↓
HybridQueryEngine
    ↓
Query State Updated
    ↓
Data Recomputed or Requested
    ↓
UI Updated

Do not create another competing search, filter, sort, or pagination state when the Query Engine already owns it.

The feature configures query behavior.

The engine manages query execution.

4. Form State

Form state represents user input before it becomes persisted business data.

Examples:

form values
validation state
dirty state
touched state
dynamic FormArray values

Form state belongs to the component responsible for the form.

Example:

Order Edit Form
    ↓
FormGroup
    ↓
Form State

The form does not automatically become the source of truth for persisted server data.

The flow should be:

Existing Entity
    ↓
Patch Form
    ↓
User Edits
    ↓
Validate
    ↓
Map to Request
    ↓
Service
    ↓
Server
    ↓
Authoritative Updated Data

Do not confuse:

Form State

with:

Persisted Entity State

They have different lifecycles.

FormArray Ownership

A FormArray belongs to the form that owns the dynamic business input.

Example:

Stationery Product Form
    ↓
FormArray
    ↓
Dynamic Product Details

The FormArray should not automatically be moved into a shared service.

Keep dynamic form state close to the form unless a genuine reusable abstraction already exists.

5. UI State

UI state controls presentation behavior without representing business data.

Examples:

modal open or closed
dropdown open
sidebar collapsed
active accordion item
selected visual tab

The owner depends on the scope.

Local UI State

If only one component needs the state:

Component
    ↓
Local UI State

Example:

Dropdown Component
    ↓
isOpen
Feature-Level UI State

If multiple feature components depend on the state:

Feature Page
    ↓
Feature UI State
    ↓
Child Components

Example:

Orders Page
    ↓
selectedOrder
modalOpen
Layout-Level UI State

If the state belongs to the application layout:

Layout
    ↓
Sidebar State
    ↓
Layout Consumers

Do not store layout state inside unrelated feature pages.

6. Temporary Interaction State

Temporary state exists only during an interaction.

Examples:

isSaving
isUploading
isRecording
current drag state
local request pending state

The owner should usually be the component or operation that initiated the interaction.

Example:

Save Button
    ↓
Submit
    ↓
isSaving = true
    ↓
Request
    ↓
Complete
    ↓
isSaving = false

Do not unnecessarily promote short-lived interaction state to global application state.

State Lifecycle

Every state should have a defined lifecycle.

Identify:

Creation
    ↓
Update
    ↓
Consumption
    ↓
Reset or Destruction

Ask:

When is this state created?
When does it change?
Who can change it?
When should it reset?
What happens when the feature is destroyed?

Do not create state without understanding its lifecycle.

Parent to Child Data Flow

Use a clear top-down flow for business data.

Feature Page
    ↓
@Input()
    ↓
Presentation Component

The child should receive what it needs.

Do not make every child independently reload data that already exists in the feature state.

Child to Parent Event Flow

Presentation components communicate interactions upward.

Child Component
    ↓
@Output()
    ↓
Feature Page
    ↓
Business Decision

The child communicates:

The user performed this action.

The feature decides:

What this action means.

Example:

Generic Table
    ↓
editClicked
    ↓
Orders Page
    ↓
Open Order Edit Modal

The table should not decide how an order is edited.

Avoid Bidirectional State Ownership

Do not allow two layers to independently own the same business state.

Bad pattern:

Parent owns selectedOrder
        ↕
Child also owns selectedOrder

Better:

Parent owns selectedOrder
        ↓
Child receives selectedOrder
        ↓
Child emits interaction
        ↓
Parent updates selectedOrder

This creates predictable state flow.

Derived State

Not every value needs its own mutable state.

If a value can be calculated from existing state, prefer deriving it.

Example:

items
+
current page
+
page size
        ↓
visibleItems

Do not store visibleItems as independent mutable state unless there is a specific reason.

Avoid duplicated state that can become inconsistent.

Async Data Flow

Async operations must have clear lifecycle ownership.

Example:

Feature Initializes
    ↓
Request Data
    ↓
Loading State
    ↓
Success
    ↓
Update Source of Truth
    ↓
UI Reacts

Handle:

loading
success
error
cleanup

according to existing repository patterns.

Do not silently ignore asynchronous failures.

Loading State

Classify loading by scope.

Global Loading

Represents application-level HTTP activity.

May be owned by:

Interceptor
    ↓
Loading Infrastructure
Feature Loading

Represents loading specific feature data.

May be owned by:

Feature / Service
Operation Loading

Represents a specific action.

Example:

Save Order
    ↓
isSaving

Do not use global loading state for every local button interaction unless that is explicitly required.

Data Flow Rules

Prefer:

Source of Truth
    ↓
Owner
    ↓
Consumer
    ↓
User Interaction
    ↓
Event
    ↓
Owner
    ↓
State Update
    ↓
UI

Avoid hidden side effects where multiple unrelated components independently modify shared business state.

State Ownership Decision

Before introducing state, determine:

Server Data

Who is the authoritative source?

Feature State

Which page or container owns the business context?

Query State

Does HybridQueryEngine already own it?

Form State

Which form component owns the user input lifecycle?

UI State

Is the scope local, feature-level, or layout-level?

Temporary State

Can it remain close to the interaction?

Required State Analysis

Before implementation, document:

State:
What does it represent?

Owner:
Which layer owns it?

Lifecycle:
When is it created and destroyed?

Updates:
Who can change it?

Consumers:
Who reads it?

Source of Truth:
Where is the authoritative value?
Final Principle

Do not ask:

Where should I store this variable?

Ask:

What kind of state is this, who owns its meaning, and what is its lifecycle?

Correct architecture requires:

Clear Ownership
    +
Single Source of Truth
    +
Predictable Data Flow
    +
Minimal State Duplication

Always prefer:

Single Direction of Data Flow

and:

One Clear Owner Per State
