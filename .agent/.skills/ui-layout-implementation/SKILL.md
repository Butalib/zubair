---
name: ui-layout-implementation
description: |
  Implement an analyzed UI specification as clean semantic HTML and simple responsive layout without pixel-positioned or unnecessarily complex CSS.
disable-model-invocation: false
---

# UI Layout Implementation

## Purpose

Convert an approved UI design specification into semantic HTML and a clean responsive layout.

This skill owns:

- HTML structure
- component structure
- layout relationships
- Flexbox
- CSS Grid
- sizing
- spacing
- responsive layout
- RTL/LTR layout behavior

Detailed visual styling belongs to the visual styling stage.

Use `code-naming-conventions` for all Angular-facing names introduced by this implementation. UI structure must not force generic names such as `data`, `item`, `value`, or `handle` when the business meaning is known.

---

# 1. Input Contract

Before implementation, an approved UI design specification must exist.

Use the specification as the source of truth.

Do not reinterpret the original screenshot unless the specification explicitly leaves something unresolved.

If the specification contains:

```text
UNKNOWN
REQUIRES_ASSET
ICON_REQUIRED

preserve that information rather than inventing a design decision.
2. Structure First

Build the page from outside to inside.

Use this order:

Page
→ Major regions
→ Containers
→ Sections
→ Components
→ Content
→ Controls

Do not begin by styling individual elements.

First make sure the DOM hierarchy represents the visual hierarchy.
3. Semantic HTML

Use HTML elements according to meaning.

Prefer:

header
nav
main
section
article
aside
footer
button
form
label
input

over generic containers.

Use:

<div>

when there is no more meaningful semantic element.

Do not introduce unnecessary wrapper elements.

Every wrapper should have a layout or semantic reason.
4. Component Boundaries

Create a component when there is a meaningful responsibility.

Good reasons:

    independent UI responsibility

    repeated structure

    reusable visual unit

    independent state

    complex internal structure

Do not create a component for every visual box.

Avoid:

Page
 ├── BoxComponent
 ├── InnerBoxComponent
 ├── LabelComponent
 ├── TextComponent
 └── ButtonWrapperComponent

when the elements belong naturally to the same feature component.

Prefer a simple structure that matches the feature responsibility.
5. Layout Decision Order

For each layout relationship choose the simplest mechanism.

Use:

1. Normal flow
2. Flexbox
3. CSS Grid
4. Positioning only when genuinely required

Do not choose a layout technology because it can reproduce the screenshot.

Choose it because it represents the actual relationship between elements.
6. Normal Flow

Use normal document flow whenever elements naturally appear one after another.

Examples:

title
description
form
actions

Do not use Flexbox or Grid when normal flow already solves the relationship.
7. Flexbox

Use Flexbox for primarily one-dimensional relationships.

Examples:

icon + text
button groups
navigation
horizontal cards
header actions
vertical stacks

Explicitly define only the properties needed:

display
flex-direction
align-items
justify-content
gap
flex-wrap

Avoid unnecessary Flexbox nesting.
8. CSS Grid

Use Grid when the layout is genuinely two-dimensional.

Examples:

sidebar + content
dashboard cards
form columns
repeated structured fields

Prefer simple explicit structures:

grid-template-columns
gap

Do not create complicated grid calculations merely to match screenshot coordinates.
9. Width and Height

Prefer responsive constraints over fixed dimensions.

Use:

width
max-width
min-width
height
min-height
aspect-ratio

according to the design specification.

Avoid fixed widths when the element should naturally adapt.

Avoid fixed heights for content containers unless the design explicitly requires them.

Never use height as a workaround for vertical alignment.
10. Spacing

Spacing must describe relationships.

Prefer:

gap
padding
margin

with a consistent spacing system.

Use gap for spacing between siblings when possible.

Use padding for internal container spacing.

Use margin for external relationships when it communicates a meaningful layout boundary.

Do not create arbitrary spacing for individual elements just because the screenshot contains a slightly different pixel distance.
11. Avoid Magic Numbers

Do not reproduce screenshot coordinates.

Avoid CSS such as:

top: 137px;
left: 428px;
margin-left: 23px;
padding: 17px 19px;

when those values exist only to imitate the screenshot.

A value is acceptable when it represents a real design constraint.

The goal is:

Design rule
→ CSS rule

not:

Screenshot pixel
→ CSS pixel

12. Absolute Positioning

position: absolute is not a general layout system.

Use it only when the element is conceptually positioned relative to another element.

Valid examples:

badge over avatar
notification indicator
overlay
floating action
decorative element

Invalid use:

placing every section at a screenshot coordinate

If normal flow, Flexbox, or Grid can solve the relationship, prefer them.
13. RTL / LTR

Respect the direction defined by the design specification.

Do not manually reverse the entire layout with arbitrary left/right overrides.

Prefer logical properties:

margin-inline
padding-inline
inset-inline
border-inline

when applicable.

For directional controls:

back
next
previous
forward

the visual direction must represent the action correctly.

Do not blindly mirror icons.
14. Responsive Layout

The desktop screenshot is not the layout contract.

The implementation must preserve relationships when the viewport changes.

Define responsive behavior based on structural changes:

row → column
multi-column → fewer columns
visible → hidden
fixed sidebar → stacked content
actions → wrapped actions

Use media queries only when the layout actually changes.

Do not add breakpoints without a reason.

Do not create a large collection of breakpoint-specific overrides.
15. Mobile / Ionic

When implementing a mobile/Ionic feature:

Use Ionic components for mobile-native UI primitives where appropriate.

Examples:

ion-button
ion-input
ion-list
ion-item
ion-icon

Do not recreate an Ionic component with generic HTML when the Ionic component already represents the required UI behavior.

The design-analysis rules remain platform-neutral.

The implementation layer decides whether the target is:

Web
→ semantic HTML + CSS

Mobile
→ Ionic components + CSS

16. Icons

Never use text characters as a substitute for an actual UI icon.

Do not implement:

<span>←</span>
<span>✓</span>
<span>✕</span>

when an icon is required.

Use the project's existing icon system.

For Web:

existing project icon system
Font Awesome when appropriate

For Ionic:

ion-icon

If the required icon is unavailable, preserve the placeholder requirement from the design analysis:

ICON_REQUIRED: <description>

Do not silently replace it with a random icon.
17. Images

Reuse existing project assets.

For missing avatar images, use the project fallback:

assets/img/dashbourd/avatar.jpg

Do not invent external image URLs.

Preserve the image behavior defined by the design specification:

object-fit
aspect-ratio
container sizing
border radius

only when required.
18. Buttons and Actions

Keep actions inside the natural layout structure.

Prefer:

action group
→ flex layout
→ gap
→ wrapping when necessary

Do not position buttons with absolute coordinates to match the screenshot.

Action hierarchy should remain clear:

primary
secondary
destructive
navigation

Do not change the semantic role of an action merely to reproduce its visual position.
19. Styling Boundary

This skill is responsible for layout.

Do not spend large amounts of CSS on:

shadows
gradients
decorative effects
complex typography
visual states

unless they are required to establish the layout.

The visual styling stage handles detailed appearance.
20. Implementation Order

Implement in this exact order:

1. Page container
2. Major regions
3. Component boundaries
4. Semantic HTML
5. Normal flow
6. Flexbox / Grid
7. Width / height constraints
8. Spacing
9. RTL / LTR
10. Responsive behavior
11. Icon/image placement
12. Minimal visual classes

Do not optimize or abstract the structure before it works.
21. Final Layout Check

Before finishing, verify:

    DOM hierarchy matches the design hierarchy.

    No unnecessary wrapper elements exist.

    Layout uses normal flow, Flexbox, or Grid where appropriate.

    Absolute positioning is limited to genuinely positioned elements.

    No screenshot-coordinate positioning exists.

    Widths and heights are responsive where appropriate.

    Spacing follows consistent relationships.

    RTL/LTR behavior is correct.

    Buttons remain structurally stable.

    Layout survives narrower viewports.

    Mobile uses Ionic components where appropriate.

    Missing icons are not replaced with text characters.

    Existing assets are reused.

    No unnecessary CSS complexity was introduced.

    No inline `style` attributes or `[style.*]` bindings were introduced for ordinary presentation.

    CSS classes carry visual decisions; Angular class bindings are simple and express genuine UI state.

    Design tokens and existing shared styles were used before introducing new values.

# 22. Styling Ownership in Angular Templates

This skill owns layout structure. Visual presentation belongs to the
component stylesheet or a shared styling layer.

## Inline Style Prohibition

Do not introduce `style="..."` attributes or Angular `[style.*]` bindings
for ordinary layout or presentation.

Acceptable exception: dynamically computed numeric values that cannot be
expressed through a CSS class (e.g., `[style.width.%]="progress"`).

## CSS Classes vs Inline Values

Always prefer semantic, reusable CSS classes for:

- Layout
- Spacing
- Typography
- Colors
- Visual states

Use existing design tokens and CSS custom properties before introducing
new values.

Do not solve layout problems through scattered inline declarations,
arbitrary style overrides, or duplicated class definitions.

## Angular Class Bindings

Angular class bindings are acceptable when they express a genuine,
changing UI state:

- `class="stable-class"` — always valid
- `[class.active]="isSelected"` — valid for a simple boolean
- `[ngClass]="{ 'item--loading': isLoading }"` — valid when intent is clear
- `[class]="computedStatusClass"` — valid when the class is derived in TypeScript

Avoid:

- Complex conditions embedded inside class bindings.
- Repeated identical conditions duplicated across elements.
- Large inline class maps that obscure component intent.
- Conditional classes compensating for an unclear component state model.
- Positional template logic (e.g., `[class.card--featured]="i === 0"`, `*ngIf="!last"` for separators) when CSS pseudo-classes (`:first-child`, `:last-child`, `:nth-child`) solve the layout directly.
- Fabricating accessible labels or `alt` texts via template index math (e.g., `'Card ' + (i + 1)`); supply genuine descriptive labels via the data model instead.

For the full class-binding and template-expression policy, see
`angular-feature-implementation` — Section 18: Template Responsibility
and Class Binding.

## Positional Layout with CSS Pseudo-Classes

When grid cells, flex items, or list entries require distinctive sizing or placement based purely on position (e.g. first card spans 2 rows, alternating row highlights, last item margins):
- Implement the rule in CSS via `:first-child`, `:last-child`, `:nth-child(...)`.
- Keep the HTML template clean and free from `$index` tracking variables and index comparison expressions.

## Continuous Marquees and Looping Tickers

When implementing infinite conveyor belts or marquee bars:
1. **Viewport Coverage Guarantee**: The content sequence width must always be greater than or equal to the viewport width ($W_{\text{sequence}} \ge W_{\text{viewport}}$). If the item list is short, replicate items or sequences sufficiently so that when translated by $-50\%$, no empty void or visual jumping occurs on large desktop screens.
2. **Seamless Item Dividers**: In continuous looped sequences, delimiters/separators (such as `+`, `•`, or divider lines) must be positioned uniformly after every item including the boundary between sequence clones, rather than suppressed on the last item with `*ngIf="!last"`.

## Global CSS

Do not introduce global CSS or `!important` as a layout shortcut when
scoped component styles are sufficient.

When a layout rule is genuinely shared, add it to the established shared
styling layer rather than duplicating it across components.
