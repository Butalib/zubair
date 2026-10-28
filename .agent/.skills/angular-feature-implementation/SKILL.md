---
description: Builds or extends Angular features according to the
  discovered Botaleb Assistant architecture. The agent must establish
  and present the feature architecture before creating implementation
  files, then stop for review and continue only after the architecture
  is approved.
name: angular-feature-implementation
---

# Angular Feature Implementation

## Purpose

This skill defines how the agent should build or extend an Angular
feature **without starting implementation immediately**.

The first responsibility is to establish the feature architecture:

``` text
Business Requirement
        ↓
Feature Boundary
        ↓
Module Hierarchy
        ↓
Routing
        ↓
Pages / Smart Responsibilities
        ↓
Feature-specific UI Parts
        ↓
Core / Shared Dependencies
        ↓
STOP FOR REVIEW
        ↓
Implementation
```

The agent must not create implementation files before the architecture
has been reviewed and approved.

------------------------------------------------------------------------

# Execution Boundary

This skill is an **implementation executor**. It consumes approved decisions; it does not independently redesign the system while coding.

Before implementation, applicable decisions must exist: requirement/scope, feature boundary, architecture placement, state ownership, domain invariants, async strategy, error behavior, and UI/UX behavior.

If a required decision is missing: **STOP → invoke the owning skill → resume only after resolution.**

Do not use implementation as a discovery mechanism for architecture.

## Implementation-Time Cross-Cutting Rules

- `code-naming-conventions` is a continuous naming constraint.
- `angular-runtime` governs Angular/Ionic lifecycle and rendering reasoning.
- `coupling-cohesion` reviews boundaries as code is introduced.
- `accessibility` governs accessible interaction behavior.

These are constraints and review lenses, not sequential implementation phases.

## Architecture Escalation

If implementation reveals a structural problem, try the smallest local change first. If the existing boundary is insufficient, escalate to `architecture-guardian`; use `architecture-evolution` only when structural change is justified by evidence.

Never introduce a new shared abstraction merely because implementation became inconvenient.

# 1. Architecture First

When a task requires creating a new feature or extending an existing
feature, begin with architecture discovery and design.

Before writing code, determine:

-   Which existing feature/module owns the requirement?
-   Whether the requirement creates a new feature or extends an existing
    one.
-   Whether the feature requires one Angular module or multiple modules.
-   Where the feature's routing belongs.
-   Which pages are required.
-   Which UI parts are feature-specific.
-   Which existing Shared UI capabilities can be reused.
-   Which Core services/interfaces are required.
-   Whether additional Core organization is required.
-   Whether the feature needs cards, directives, pipes, or modals.
-   Which existing conventions must be preserved.

Do not create files merely because a folder is available.

Create only the responsibilities required by the feature.

------------------------------------------------------------------------

# 2. Feature vs Module

A **Feature** represents a business/functional capability.

A feature may contain one or multiple Angular modules.

Example:

``` text
products/
├── products-module
├── products-routing-module
│
├── products-page/
│
├── notebooks/
│   ├── notebooks-module
│   └── notebooks-routing-module
│
└── stationery/
    ├── stationery-module
    └── stationery-routing-module
```

The parent feature groups related functionality.

Child modules represent separate Angular module boundaries inside that
feature.

Do not assume:

``` text
one feature = one module
```

The correct relationship is:

``` text
Feature
    ↓
one or more related Modules
```

------------------------------------------------------------------------

# 3. Root Module Hierarchy

A new feature must first be attached to the correct parent module.

For a top-level application feature:

``` text
src/app/modules/
└── <feature>/
```

The parent application module/routing hierarchy should remain
responsible for loading the feature.

Example:

``` text
ModuleRoutingModule
        ↓
ProductsModule
        ↓
ProductsRoutingModule
        ↓
NotebooksModule / StationeryModule
```

Preserve lazy-loading and the existing routing strategy when the
repository already uses it.

Do not redesign routing as part of an ordinary feature implementation
unless the requirement explicitly requires architectural change.

------------------------------------------------------------------------

# 4. Feature Architecture Proposal

Before implementation, produce a concrete proposal.

Example:

``` text
Feature: Orders

modules/orders/
│
├── orders-module.ts
├── orders-routing-module.ts
│
├── orders-page/
│   └── orders-page.ts
│
├── order-details-page/
│   └── order-details-page.ts
│
├── components/
│   └── order-items/
│
└── modal/
    ├── order-confirmation/
    └── order-details-modal/
```

Then explicitly describe dependencies:

``` text
Orders Pages
    ↓
Feature Components / Modals
    ↓
Shared UI Toolkit

Orders Pages
    ↓
Core Services
    ↓
Core Interfaces
```

The proposal must identify ownership.

------------------------------------------------------------------------

# 5. Pages

Pages are the feature's **smart/orchestration layer**.

A page may coordinate:

-   feature state
-   query state
-   route state
-   user actions
-   service calls
-   modal state
-   shared components
-   feature-specific components
-   navigation
-   loading/error/empty states

Pages should not become an uncontrolled dumping ground for reusable
business logic.

If logic is reusable or belongs to another architectural responsibility,
identify the appropriate existing owner before moving it.

------------------------------------------------------------------------

# 6. Components

The `components` area is for UI parts that are specifically required by
the feature.

Use a feature component when:

-   the UI has feature-specific meaning;
-   the behavior is specific to the feature;
-   the component is not already available in the Shared UI Toolkit;
-   extracting it improves the feature's structure or reuse inside that
    feature.

Do not create a feature component just to wrap an existing Shared
component without a real responsibility.

Prefer:

``` text
Shared GenericTable
        ↑
    consumed by
        ↑
Orders Page
```

instead of duplicating a GenericTable implementation inside Orders.

------------------------------------------------------------------------

# 7. Modals

A feature may contain a `modal` area when the feature requires
feature-specific modal/dialog behavior.

Example:

``` text
orders/
└── modal/
    ├── order-confirmation/
    └── order-details-modal/
```

Do not create the folder if no feature-specific modal is required.

Use Shared modal infrastructure when the project already provides
generic modal behavior.

The feature owns:

-   when the modal opens;
-   when it closes;
-   what feature context it receives;
-   what business action follows the result.

The reusable modal component owns generic modal presentation and
interaction behavior.

------------------------------------------------------------------------

# 8. Core Ownership

In this project architecture, services and interfaces are owned by
`core`.

Do not place feature services or feature interfaces under:

``` text
modules/<feature>/services
modules/<feature>/interfaces
```

unless the repository architecture is explicitly changed and approved.

Current Core organization:

``` text
src/app/core/
├── service/
├── interface/
├── enum/
└── interceptor/
```

Feature-related Core artifacts should be organized by feature when the
number of artifacts makes grouping useful.

Preferred evolution:

``` text
core/
├── service/
│   ├── orders/
│   │   └── orders.service.ts
│   ├── students/
│   │   └── students.service.ts
│   └── ...
│
└── interface/
    ├── orders/
    │   └── IOrder.ts
    ├── students/
    │   └── IStudent.ts
    └── ...
```

Do not reorganize the entire Core automatically during an unrelated
feature task.

If the existing structure requires a broader refactor, identify it
separately and stop for architectural review.

------------------------------------------------------------------------

# 9. Shared Ownership

The Shared area contains reusable UI capabilities.

Examples from the project include:

``` text
modules/shared/kit/
├── generic-table-component/
├── confirmation-dialog/
├── inner-action-header/
└── ...
```

Before creating a new feature-specific UI component, inspect Shared.

Decision:

``` text
Required capability
        ↓
Already exists in Shared?
   ┌────┴────┐
   │         │
  Yes        No
   ↓         ↓
Reuse    Is it feature-specific?
             │
        ┌────┴────┐
        │         │
       Yes        No
        ↓         ↓
 Feature UI    Shared candidate
```

Do not duplicate an existing reusable component.

------------------------------------------------------------------------

# 10. Cards, Directives, and Pipes

These are optional feature parts.

Create them only when the feature needs them.

Possible structure:

``` text
<feature>/
├── cards/
├── directives/
└── pipes/
```

Use these areas for feature-specific responsibilities.

If a pipe/directive is generic and reusable across unrelated features,
it should follow the project's Shared/Core ownership convention rather
than being duplicated per feature.

------------------------------------------------------------------------

# 11. Routing

Each Angular module that owns navigable functionality should have its
routing responsibility defined clearly.

Typical structure:

``` text
<feature>/
├── <feature>-module.ts
└── <feature>-routing-module.ts
```

For nested modules:

``` text
products/
├── products-module.ts
├── products-routing-module.ts
│
├── notebooks/
│   ├── notebooks-module.ts
│   └── notebooks-routing-module.ts
│
└── stationery/
    ├── stationery-module.ts
    └── stationery-routing-module.ts
```

Routing responsibilities:

-   map URLs to feature pages/modules;
-   preserve route hierarchy;
-   preserve lazy-loading where already established;
-   pass route parameters through the existing mechanism;
-   avoid embedding business operations inside routing configuration.

------------------------------------------------------------------------

# 12. Naming Contract

Apply `code-naming-conventions` while defining architecture and
implementation names.

Names must communicate:

-   business meaning;
-   responsibility;
-   ownership;
-   lifecycle;
-   data shape;
-   direction where applicable.

Do not postpone naming decisions until after implementation.

Example:

``` text
orders-page
order-details-page
order-items
order-confirmation
OrdersService
IOrder
```

Prefer domain language over generic names such as:

``` text
data
item
value
result
handle
process
temp
```

------------------------------------------------------------------------

# 13. Architecture Review Gate

This is a mandatory stopping point.

After discovery and architecture design, the agent must present:

### Feature Boundary

``` text
What feature is being created or extended?
```

### Module Hierarchy

``` text
Which module(s) will exist?
Which module is the parent?
Which modules are nested?
```

### Routing

``` text
Which routes will be added or changed?
```

### Pages

``` text
Which pages are required?
What is each page responsible for?
```

### Feature UI

``` text
Which components/cards/modals/directives/pipes are required?
```

### Shared Reuse

``` text
Which existing Shared components will be reused?
```

### Core Dependencies

``` text
Which Core services/interfaces/enums are required?
```

### File Placement

``` text
Where will each new responsibility live?
```

### Risks / Open Questions

``` text
What architectural decisions are uncertain?
What could affect existing features?
```

Then:

``` text
STOP
```

Do not create implementation files.

Do not scaffold the feature.

Do not modify existing code.

Wait for review/approval.

------------------------------------------------------------------------

# 14. After Approval

Only after architecture approval:

``` text
Approved Architecture
        ↓
Create Module / Routing
        ↓
Create Pages
        ↓
Create Feature UI Parts
        ↓
Connect Shared Components
        ↓
Connect Core Services / Interfaces
        ↓
Implement Behavior
        ↓
Testing & Proof
        ↓
Validation
```

The implementation must follow the approved architecture.

If implementation reveals that the approved architecture is
insufficient, stop and propose the architectural change instead of
silently changing the structure.

------------------------------------------------------------------------

# 15. Architecture Drift Detection

During implementation, continuously check:

-   Did a feature responsibility accidentally move into Shared?
-   Did feature-specific logic enter a generic component?
-   Did a service get created in the feature instead of Core?
-   Did an interface get duplicated?
-   Did a new component duplicate an existing Shared component?
-   Did a page become responsible for unrelated reusable logic?
-   Did a nested module become coupled to unrelated features?
-   Did routing responsibilities leak into components?
-   Did the implementation create folders with no real responsibility?

If architectural drift is detected:

``` text
Detect
  ↓
Explain
  ↓
Propose correction
  ↓
Stop if correction changes the approved architecture
```

------------------------------------------------------------------------

# 16. Do Not Over-Abstract

Do not create:

-   generic components;
-   generic services;
-   shared utilities;
-   extra modules;
-   abstractions;
-   wrappers;

without a demonstrated reuse or responsibility boundary.

Prefer:

``` text
Specific requirement
        ↓
Smallest correct responsibility
        ↓
Extract only when reuse / ownership justifies it
```

------------------------------------------------------------------------

# 17. Definition of Done

A feature is not complete merely because the files compile.

Before completion verify:

``` text
✓ Feature boundary is correct
✓ Module hierarchy is correct
✓ Routing is correct
✓ Pages have clear orchestration responsibility
✓ Feature-specific UI is correctly placed
✓ Shared components are reused where appropriate
✓ Core services/interfaces follow Core ownership
✓ No unnecessary folders were created
✓ Naming follows the naming contract
✓ Architecture did not drift
✓ Testing & Proof was performed
✓ Template expressions are simple and proportional to the UI requirement
✓ No inline styles or unnecessary style bindings were introduced
✓ CSS classes, design tokens, and component stylesheets carry visual decisions
```

------------------------------------------------------------------------

# 18. Template Responsibility and Class Binding

## What Belongs in the Template

An Angular template should primarily:

- Describe semantic UI structure.
- Render component state through interpolation and property bindings.
- Declare user interactions through event bindings.
- Use Angular control-flow (`@if`, `@for`, `@switch`) to conditionally render or iterate over content.

These are always acceptable in templates.

## What Belongs in TypeScript

Move logic out of the template when it:

- Involves nontrivial calculations or transformations.
- Represents derived presentation state used in more than one place.
- Contains business rules or domain decisions.
- Uses nested ternaries or complex compound conditions.
- Calls methods that perform expensive work or cause side effects.
- Would be clearer as a named TypeScript property or computed getter.

Prefer a named property or getter:

```typescript
// Preferred
get isDeadlineNear(): boolean {
  return this.daysRemaining <= 3 && !this.isCompleted;
}
```

Over an equivalent expression scattered across multiple template locations.

Do not move every expression into TypeScript mechanically.
Simple property access, interpolation, straightforward boolean conditions,
and single-level method calls whose intent is obvious are acceptable in
the template.

The objective is a template whose logic is **easy to understand** and
whose complexity is **proportional to the UI requirement** — not a
zero-expression template.

## Avoid in Templates

- Nested ternary expressions.
- Repeated identical conditions across multiple elements.
- Business rules embedded in HTML.
- Method calls that perform expensive work or cause side effects on every
  change-detection cycle.
- Large inline object or array literals.

## Class Binding — Valid and Prohibited Uses

### Valid

These express a genuine, visible UI state:

```html
<!-- Static class — always acceptable -->
<div class="card card--primary">

<!-- Simple boolean toggle -->
<li [class.active]="isSelected">

<!-- Multiple conditional classes when intent is clear -->
<button [ngClass]="{ 'btn--loading': isSaving, 'btn--disabled': isDisabled }">

<!-- Class driven by a computed TypeScript property -->
<div [class]="statusClass">

<!-- PREFERRED: When data has a named variant/theme ('success' | 'error' | 'navy' | 'bronze') -->
<!-- use class interpolation instead of multiple boolean [class.x]="y === 'x'" checks -->
<p class="newsletter__message newsletter__message--{{ status }}">
<a class="promo-banner promo-banner--{{ theme }}" [routerLink]="link">
```

> [!TIP]
> When a data property is a string union that directly maps to a BEM modifier (e.g. `'success' | 'error'`, `'navy' | 'bronze'`), prefer `class="base base--{{ variant }}"` interpolation over writing one `[class.base--x]="prop === 'x'"` per variant. This eliminates repeated equality checks and keeps templates declarative.

### Avoid

```html
<!-- Complex condition embedded in the binding -->
<div [class.highlighted]="item.score > 80 && !item.archived && user.role === 'admin'">

<!-- Same condition repeated on multiple elements -->
<li [class.active]="tab === 'overview' && !loading">
<li [class.active]="tab === 'details' && !loading">

<!-- Large inline class map that obscures intent -->
<div [ngClass]="{ 'a': x, 'b': !x && y, 'c': !x && !y && z, 'd': condition4 }">

<!-- Mixing styling decisions with business logic -->
<div [class.error]="form.get('email').invalid && form.get('email').touched && attemptCount > 2">

<!-- Positional/structural styling in template — use CSS pseudo-classes instead -->
<div class="card" [class.card--featured]="i === 0"> <!-- AVOID: use .card:first-child in CSS -->
<span *ngIf="!last" class="separator">+</span>       <!-- AVOID: in continuous tickers or when CSS handles dividers -->

<!-- Synthesizing labels via loop index math and string concatenation -->
<a [attr.aria-label]="'عنصر ' + (i + 1)">           <!-- AVOID: provide meaningful title in data model -->
  <img [alt]="'صورة ' + (i + 1)">
</a>
```

### Data-Driven Accessibility & Semantic Labels Over Template Fabrication

Never declare `let i = $index` solely to manufacture placeholder labels, `aria-label`s, or image `alt` texts via string concatenation (`'Item ' + (i + 1)`):
- If an entity, slide, or link requires an accessible name or alt text, declare it directly in the TypeScript interface (e.g., `title: string` or `altText: string`) and supply genuine descriptive text in the data source.
- Bind the template directly to the data property: `[attr.aria-label]="item.title"` and `[alt]="item.title"`.
- Keeps templates declarative, removes unnecessary `$index` declarations, and ensures assistive technology users receive real, meaningful information.

### Positional and Structural Styling Belongs to CSS, Not Template Logic

Do not pollute Angular templates with structural or positional logic (such as checking indexes `i === 0`, `$first`, `$last`, `i % 2 === 0`, or `*ngIf="!last"`) when the styling or layout relationship can be expressed directly and cleanly in CSS.

- **Prefer Native CSS Pseudo-classes**:
  - Use `:first-child`, `:last-child`, `:nth-child(...)`, `:nth-of-type(...)`, `:only-child`, or `:empty` in the component stylesheet.
  - Keeps templates clean, declarative, and focused solely on semantic HTML and data bindings.
  - Eliminates unnecessary template tracking variables (`let i = $index`) and conditional class bindings.

- **When Class Binding IS Justified**:
  - When the state is driven by genuine **business or domain data** (e.g. `[class.product--out-of-stock]="!product.inStock"`, `[class.active]="tab.selected"`).
  - When the styling depends on asynchronous states or user interactions (`[class.is-loading]="loading"`, `[class.is-open]="menuOpen"`).

When conditional styling becomes complex or is repeated, derive a clear
presentation-state property in TypeScript and let CSS rules handle the
visual outcome.

## Responsibility Ownership Model

| Layer | Owns |
|---|---|
| Component TypeScript | Component behavior, event handling, local UI state, presentation-state derivation |
| HTML Template | Semantic structure, rendering, straightforward bindings, event declarations |
| Component SCSS/CSS | Visual rules, layout, responsive behavior, styling states |
| Shared styles / design tokens | Genuinely shared visual conventions, CSS custom properties |

Do not force business logic into services merely to remove it from a
template. Move each responsibility to the appropriate owner from this
table.

## Inline Style Prohibition

Do not use `style="..."` attributes or Angular `[style.*]` bindings for
ordinary presentation.

Inline styles are acceptable only in rare, justified cases such as
dynamically computed numeric values (e.g., `[style.width.%]="progress"`).

All other visual decisions belong in the component stylesheet or a
shared styling layer.

------------------------------------------------------------------------

# Final Principle

**Do not build the feature first and discover its architecture
afterward.**

The required sequence is:

``` text
Discover
   ↓
Model the Feature
   ↓
Design the Module Hierarchy
   ↓
Define Routing
   ↓
Define Responsibilities
   ↓
Define Dependencies
   ↓
Present Architecture
   ↓
STOP FOR REVIEW
   ↓
Implement
   ↓
Prove
   ↓
Validate
```

The architecture is a decision.

Implementation is the execution of that decision.

Do not mix the two phases.
