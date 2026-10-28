---
name: ui-ux-design-analysis
description: Analyze a screenshot, Figma design, or UI reference and reconstruct its visual structure, UX behavior, component boundaries, responsive intent, and implementation constraints before UI implementation.
disable-model-invocation: false
---

# UI / UX Design Analysis

## Purpose

Turn a visual reference into an implementation-ready **UI + UX specification**.

This skill answers:

> **What should the interface look like, how should it behave, and what structural rules must implementation preserve?**

It does not implement HTML, SCSS, Angular/Ionic components, or application logic.

---

## HARD RULE

Never start implementation directly from a screenshot or Figma reference.

First reconstruct:

```text
Visual Structure
→ UX Intent
→ Interaction / State Behavior
→ Component Boundaries
→ Responsive Rules
→ Implementation Specification
```

Do not chase pixel-perfect coordinates when the underlying layout relationship is what matters.

---

# 1. Inspect the Entire Design First

Identify the major regions before analyzing individual elements.

Example:

```text
Page
├── Header
├── Sidebar
└── Main Content
    ├── Page Header
    ├── Summary
    ├── Filters
    └── Data Section
```

Do not assume every visual group requires a component.

Distinguish:

- page structure
- reusable UI component
- feature-specific component
- simple grouping

---

# 2. Visual Hierarchy

Determine what the user should notice first, second, and third.

Identify:

- page title
- section titles
- primary actions
- secondary actions
- important information
- supporting information
- status indicators
- navigation
- data/content regions

Preserve the intended hierarchy.

---

# 3. UX Intent

Infer the user-facing purpose supported by the design.

Identify:

- primary user task
- secondary tasks
- expected entry point
- primary action
- expected completion state
- important decision points
- feedback expected after actions

Do not invent product requirements that are not supported by the design or approved specification.

If intent is ambiguous, mark it as an open question.

---

# 4. Interaction and State Behavior

For interactive elements, identify expected states where they are visible or reasonably implied:

```text
Default
Hover
Focus
Active
Disabled
Loading
Success
Error
Empty
Expanded / Collapsed
Selected
```

For important interactions, describe:

```text
User Action
→ UI Response
→ Result
→ Recovery / Next Action
```

Coordinate failure/recovery semantics with `error-state-design`.

Do not define business rules here.

---

# 5. Page Structure and Containers

Reconstruct:

- page regions
- container hierarchy
- max-width behavior
- full-width vs constrained sections
- nested content areas
- alignment relationships
- horizontal and vertical grouping

Prefer structural relationships over absolute coordinates.

---

# 6. Layout Mechanism

Determine the likely layout mechanism:

- Flexbox
- CSS Grid
- normal document flow
- absolute positioning
- sticky/fixed positioning
- overlay/modal positioning

Use absolute positioning only when the design relationship requires it.

---

# 7. Spacing and Sizing

Extract the visual rhythm:

- page padding
- section gaps
- component gaps
- internal padding
- control heights
- card dimensions
- spacing scale

Look for repeated values and design tokens rather than treating every measurement as unique.

---

# 8. Typography

Identify:

- font family when known
- heading hierarchy
- font sizes
- weights
- line heights
- text alignment
- truncation/wrapping behavior

Preserve readability and hierarchy rather than copying isolated font values.

---

# 9. Colors, Borders, and Surfaces

Identify:

- background hierarchy
- surface hierarchy
- text hierarchy
- accent colors
- semantic colors
- borders
- dividers
- radius
- shadows

Prefer existing project design tokens when repository evidence shows them.

Do not invent a second visual system unnecessarily.

---

# 10. Icons, Images, and Assets

Determine:

- icon type
- approximate size
- placement
- image aspect ratio
- cropping behavior
- object-fit intent
- placeholder behavior

Prefer existing project assets and icon conventions.

---

# 11. RTL / LTR

Determine:

- text direction
- alignment
- icon placement
- directional spacing
- navigation flow
- mirroring requirements

Do not treat RTL as simply changing `text-align`.

---

# 12. Responsive Intent

Infer how the layout should behave across viewport sizes:

- what remains fixed
- what grows/shrinks
- what wraps
- what stacks
- what hides
- what becomes scrollable
- what changes interaction pattern

Separate evidence from inference.

---

# 13. Component Boundaries

Classify each meaningful UI unit as:

### Existing Shared Component

Reuse when the repository already provides the responsibility.

### Reusable Component

Extract only when the responsibility is genuinely generic and reuse is supported.

### Feature-Specific Component

Keep local when it contains feature-specific meaning.

Do not decide architecture from visual similarity alone.

For shared-vs-feature placement use:

`shared-vs-feature-specific`

For final architectural decisions use:

`architecture-guardian`

---

# 14. Existing Project First

Before proposing new UI primitives:

1. Inspect existing design tokens.
2. Inspect shared components.
3. Inspect layout conventions.
4. Inspect icon/image conventions.
5. Inspect responsive patterns.
6. Reuse established patterns where they fit.

Do not create a visually correct but architecturally inconsistent implementation.

---

# 15. Accessibility-Relevant UX

Flag visible or inferable requirements such as:

- meaningful labels
- keyboard/focus visibility
- sufficient target size
- semantic grouping
- modal interaction expectations
- status/error communication

Do not replace the dedicated accessibility skill.

This section identifies UX requirements that implementation validation should not miss.

---

# 16. Output Before Implementation

Produce a concise implementation specification:

```text
Page Goal:
...

Primary User Task:
...

Structure:
...

Visual Hierarchy:
...

Interactions / States:
...

Component Boundaries:
...

Layout Rules:
...

Responsive Rules:
...

Typography:
...

Colors / Surfaces:
...

Assets:
...

RTL / LTR:
...

Accessibility Flags:
...

Existing Patterns To Reuse:
...

Open Questions:
...
```

The output should be sufficient for the UI implementation skill to execute without repeatedly reinterpreting the original design.

---

# Relationship With Other Skills

- `spec-kit-pre-implementation` owns the pre-implementation workflow.
- `repository-discovery` provides repository evidence.
- `shared-vs-feature-specific` analyzes responsibility placement.
- `architecture-guardian` owns final architectural decisions.
- `error-state-design` owns detailed failure and recovery behavior.
- `ui-ux-design-analysis` owns visual + UX analysis of the interface.
- `ui-layout-implementation` owns translating the specification into layout/components.
- `ui-mobile-layout-implementation` owns mobile-specific layout implementation.
- `ui-web-visual-styling` owns detailed web visual styling.
- `testing-proof` proves important UI behavior.
- `implementation-validation` validates the implemented result against requirements and design intent.

Do not duplicate implementation responsibilities here.

---

## Core Principle

> **Analyze the design system, structure, user intent, and interaction states before writing UI code.**
