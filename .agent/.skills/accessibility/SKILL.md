---
name: accessibility
description: Design, implement, and validate accessible web and Ionic interfaces across keyboard, focus, semantics, forms, dialogs, status communication, touch targets, and assistive technology behavior.
disable-model-invocation: false
---

# Accessibility

## Purpose

Ensure that interface behavior remains usable by people with different input methods, sensory abilities, and assistive technologies.

This skill answers:

> **Can users perceive, operate, understand, and recover from this interface regardless of how they interact with it?**

Accessibility is a behavioral and structural requirement, not only a visual styling concern.

---

# Ownership Boundary

This skill owns **accessibility requirements, interaction rules, and accessibility-specific review criteria**. It does not own the general test strategy or final implementation acceptance.

```text
accessibility → defines accessibility requirements/behavior
testing-proof → proves selected accessibility behavior when executable proof is required
implementation-validation → checks final conformance
```

Do not turn accessibility validation into a duplicate general QA process.

# 1. Accessibility First Principles

For each interaction, consider:

```text
Perceivable
Operable
Understandable
Robust
```

Do not reduce accessibility to adding ARIA attributes.

Prefer native semantic HTML and platform controls before custom behavior.

---

# 2. Semantic Structure

Use elements according to meaning:

- `button` for actions
- `a` for navigation
- headings for document hierarchy
- labels for form controls
- lists for list structures
- tables for tabular data
- landmarks for major regions

Avoid:

```text
<div (click)="...">
```

when a semantic interactive element exists.

If a custom control is unavoidable, define its:

- role
- keyboard behavior
- focus behavior
- accessible name
- state

---

# 3. Keyboard Accessibility

Every interactive feature must have a keyboard path where the platform supports keyboard interaction.

Check:

- Tab navigation
- Shift+Tab
- Enter
- Space
- Escape
- Arrow keys where appropriate
- logical order
- visible focus
- no keyboard trap

Do not create custom keyboard shortcuts without considering conflicts and discoverability.

---

# 4. Focus Management

For dialogs, overlays, menus, navigation changes, and dynamic content define:

```text
Focus Before:
...

Focus After Open:
...

Focus During:
...

Focus After Close:
...

Focus On Error:
...
```

Important patterns:

### Modal

```text
Open
→ Move focus into dialog
→ Keep focus within dialog when required
→ Escape / close
→ Return focus to trigger
```

### Navigation

Move or preserve focus so the user can identify the new page/context.

### Validation Error

Provide a clear path to the first relevant invalid field without unexpectedly disrupting the user.

---

# 5. Forms

Every form control needs an accessible relationship with its label.

Check:

- label association
- required state
- invalid state
- help text
- error message association
- keyboard access
- autocomplete where appropriate

Do not rely on placeholder text as the only label.

---

# 6. Error Communication

Errors must be perceivable without relying only on color or visual placement.

Coordinate with:

`error-state-design`

Check:

- clear message
- affected control identification
- programmatic association where required
- status announcement when appropriate
- recovery action
- focus behavior

Do not expose raw backend errors.

---

# 7. Loading and Status Communication

Dynamic changes may need accessible status communication.

Examples:

- loading
- saving
- success
- error
- progress
- asynchronous content updates

Determine whether the user needs:

```text
Visual feedback
+
Programmatic status
```

Avoid excessive announcements that create noise.

---

# 8. Dialogs, Modals, and Overlays

For modal/dialog interactions define:

- accessible name
- role
- initial focus
- focus containment when required
- Escape behavior
- close control
- focus restoration
- background interaction rules

For non-modal overlays such as menus/popovers, do not automatically apply modal focus trapping.

Choose behavior based on the interaction pattern.

---

# 9. Menus and Composite Widgets

Custom widgets must have consistent keyboard semantics.

Examples:

- tabs
- menus
- listboxes
- comboboxes
- accordions
- trees
- date pickers

Do not invent keyboard behavior when an established interaction pattern exists.

---

# 10. Touch and Mobile Accessibility

For Ionic/mobile interfaces, check:

- adequate touch target size
- spacing between adjacent controls
- gestures have accessible alternatives
- swipe-only actions have another mechanism
- orientation assumptions
- keyboard/assistive technology behavior
- screen-reader navigation

Do not make a gesture the only way to perform an important action.

---

# 11. Visual Accessibility

Check:

- text contrast
- non-text contrast where relevant
- color is not the only status indicator
- readable text size
- visible focus
- sufficient spacing
- zoom/reflow behavior
- motion sensitivity

Do not solve contrast by sacrificing semantic hierarchy.

---

# 12. Images and Icons

For each image determine:

```text
Decorative
Informative
Functional
Complex
```

Then define the appropriate accessible treatment.

For icons:

- decorative icon → hide from assistive technology when appropriate
- functional icon → accessible name
- icon + visible text → avoid duplicate announcement

Do not give every icon an `aria-label` mechanically.

### Meaningful and Data-Driven Accessible Names (No Index-Synthesized Labels)

Never synthesize placeholder accessible names, `aria-label`s, or `alt` texts in templates using index math or string concatenation:

```html
<!-- AVOID: Fake placeholder labels generated via loop index -->
[attr.aria-label]="'عنصر ' + (i + 1)"
[alt]="'صورة ' + (i + 1)"
```

- **Why this is prohibited**:
  Generic names like "صورة 1" or "عنصر 2" fail the core purpose of accessibility; assistive technology users receive zero meaningful context about what the image portrays or where the link leads.
- **Data-Driven Requirement**:
  - If an image, card, or link represents meaningful content, the data model / interface must define a descriptive property (such as `title`, `label`, or `altText`).
  - The template must bind directly to the data property: `[alt]="item.title"` and `[attr.aria-label]="item.title"`.
  - If an image is purely decorative, use `alt=""` or `aria-hidden="true"`, never a synthetic numbered label.

---

# 13. Tables and Data-Dense UI

Check:

- table semantics
- header relationships
- sortable column state
- pagination controls
- row actions
- empty state
- loading state
- error state

For responsive tables, ensure information remains understandable when layout changes.

---

# 14. Dynamic Rendering and Angular/Ionic

Accessibility behavior must survive framework-driven UI changes.

Coordinate with:

`angular-runtime`

and for Ionic:

- page lifecycle
- overlays
- modal components
- navigation
- dynamic content

When a view is cached or re-entered, verify that focus and status state do not become stale.

---

# 15. RTL / LTR

Check accessibility-related direction behavior:

- reading order
- focus order
- icon direction
- navigation direction
- keyboard expectations
- mirrored controls

RTL should not break logical interaction order.

---

# 16. Reduced Motion

Animations and transitions should not be required to understand or operate the interface.

Respect reduced-motion preferences when motion could cause discomfort or interfere with use.

---

# 17. Testing and Validation

Accessibility should be validated at multiple levels:

```text
Semantic Inspection
→ Keyboard Testing
→ Focus Testing
→ Screen Reader Testing
→ Automated Checks
→ Real Interaction Testing
```

Automated tools are useful but do not prove full accessibility.

Coordinate behavioral proof with:

`testing-proof`

and overall quality with:

`implementation-validation`.

---

# 18. Stop Conditions

Stop and inspect further when:

- custom interaction has no defined keyboard behavior
- focus behavior is undefined for a modal/overlay
- an important action is gesture-only
- errors are only communicated through color
- dynamic content changes without an accessible status strategy
- accessible name is ambiguous
- a screen-reader interaction is uncertain
- the design conflicts with basic accessibility requirements

Do not guess interaction semantics for complex widgets.

---

# 19. Output

Produce:

```text
Interactive Element:
...

Semantic Element:
...

Accessible Name:
...

Keyboard Behavior:
...

Focus Behavior:
...

State Communication:
...

Error Communication:
...

Touch / Gesture:
...

Screen Reader Consideration:
...

Visual Accessibility:
...

Angular / Ionic Consideration:
...

Validation Method:
...

Open Questions:
...
```

---

# Relationship With Other Skills

- `ui-ux-design-analysis` identifies accessibility requirements visible or inferable from the design.
- `accessibility` owns accessibility behavior and validation.
- `ui-layout-implementation` implements layout structure.
- `ui-mobile-layout-implementation` handles mobile layout implementation.
- `ui-web-visual-styling` handles detailed visual styling.
- `angular-runtime` handles framework lifecycle/rendering behavior.
- `error-state-design` handles failure/recovery semantics.
- `testing-proof` provides executable behavioral proof.
- `implementation-validation` validates overall conformance.

Do not duplicate visual-design responsibilities.

---

## Core Principle

> **Accessibility is complete only when the user can perceive, operate, understand, and recover from the interface—not merely when ARIA attributes exist.**
