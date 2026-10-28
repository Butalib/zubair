---
name: Botaleb Assistant-project-context
description: Provides the essential Botaleb Assistant project architecture and existing infrastructure context required to help agents reuse the current system instead of recreating it.
disable-model-invocation: false
---

# Botaleb Assistant Project Context

## Project Principle

Botaleb Assistant already contains established shared and generic infrastructure.

Before creating anything new, inspect and reuse the existing implementation.

The goal is to extend the current system, not recreate it.

---

# Existing Architecture

## Feature Pages

Feature pages are usually the main containers.

They own feature-level orchestration such as:

- coordinating services
- selected entities
- modal state
- business actions
- route integration

Feature-specific child components should receive data and emit interactions when appropriate.

---

## GenericCrudService

The project uses GenericCrudService for reusable CRUD behavior.

Before creating feature CRUD logic or duplicating HTTP operations:

- inspect GenericCrudService
- inspect existing feature services
- reuse the existing data flow

Do not create a parallel CRUD service without a clear requirement.

---

## HybridQueryEngine

The project contains a generic HybridQueryEngine.

It supports query behavior such as:

- search
- filtering
- sorting
- pagination
- local/server query modes

Expected flow:

User Interaction
    ↓
Feature
    ↓
Query State
    ↓
HybridQueryEngine
    ↓
Result
    ↓
UI

Do not duplicate filtering, sorting, or pagination logic inside the Generic Table.

---

## GenericTable

GenericTable is a shared presentation component.

It:

- displays data
- renders configured columns
- renders actions
- emits user interactions

The feature owns what actions mean.

For example:

GenericTable
    ↓
edit action
    ↓
Feature Page
    ↓
Feature-specific edit flow

Do not put feature business logic inside GenericTable.

---

## Shared UI

Before creating a new UI component, inspect the existing shared components.

Common shared responsibilities include:

- modal shells
- buttons
- inputs
- selects
- tables
- upload controls

Reuse existing shared infrastructure whenever it fits.

Feature-specific forms and business UI should remain inside their features.

---

# State Ownership

Keep state ownership clear.

## Server Data

Owned by the existing data/service layer.

## Feature State

Usually owned by the feature page or container.

## Query State

Owned by HybridQueryEngine when used.

## Form State

Owned by the feature form.

## Shared UI State

Owned by the shared component when it represents generic UI behavior.

## Layout State

Owned by the layout or relevant layout infrastructure.

Do not create competing sources of truth.

---

# Reuse Rule

Before creating:

- a component
- a service
- a modal
- a table
- a query mechanism
- a loading mechanism
- an upload mechanism

search the repository first.

Classify the solution as:

- Reuse
- Extend
- Feature-Specific

Create something new only when necessary.

---

# Change Scope

Modify only what is required for the task.

Do not:

- refactor unrelated code
- replace working architecture
- duplicate existing infrastructure
- create speculative abstractions

Prefer the smallest correct change.

---

# Key Feature Context

## Orders

Existing architecture may already contain:

- order listing
- GenericTable integration
- actions
- details page structure
- reusable CRUD patterns

Inspect the existing Orders implementation before modifying or extending it.

## Students

Student work may include:

- add/edit forms
- student details
- student-related orders or products

Reuse existing form and modal patterns.

## Conversations

Conversations may require:

- conversation list
- active conversation
- messages
- sending messages
- image attachment
- video validation
- voice recording

Do not build the entire feature as one component.

Reuse existing infrastructure where applicable.

## Products

Products include different business types.

Do not force all product-specific business rules into a generic abstraction.

Keep product-type-specific forms and dynamic FormArray behavior inside the feature unless an existing reusable abstraction clearly applies.

---

# Final Rule

Botaleb Assistant is an existing system.

The correct workflow is:

Understand the requirement
    ↓
Inspect existing code
    ↓
Reuse current architecture
    ↓
Identify the missing gap
    ↓
Make the smallest correct change
