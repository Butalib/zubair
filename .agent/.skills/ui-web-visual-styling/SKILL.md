---
name: ui-web-visual-styling
description: |2
   Apply accurate, maintainable web visual styling to an approved UI layout using simple CSS/SCSS, consistent spacing, typography, colors, states, and responsive rules.
disable-model-invocation: false
---

# UI Web Visual Styling

## Purpose

Apply the visual design to an already approved HTML and layout structure.

This skill owns detailed Web visual styling.

It does not redesign the layout.

It does not replace the existing component architecture.

It does not rewrite the HTML unless a small semantic correction is required.

If Angular-facing names are added or changed as part of a necessary semantic correction, follow `code-naming-conventions`. Do not rename unrelated code merely during visual styling.

---

# 1. Styling Before Changing Structure

The existing HTML/layout is the starting point.

Before changing structure:

1. Check whether the visual problem can be solved with CSS.
2. Prefer fixing the existing layout.
3. Change HTML only when the structure itself prevents correct styling.

Do not rebuild a component just because the styling is difficult.

---

# 2. CSS Property Order

When creating or modifying a class, think in this order:

```text
1. display / layout
2. positioning
3. width / height
4. spacing
5. typography
6. colors
7. borders
8. radius
9. shadows
10. visual states

Keep related declarations together.

Do not randomly scatter CSS properties across multiple overrides.

3. Layout Preservation

This skill must not introduce unnecessary layout complexity.

Prefer:

normal flow
Flexbox
Grid

before:

absolute positioning
negative margins
complex calculations

Do not use visual styling as an excuse to create layout hacks.

4. No Pixel Painting

Never recreate the screenshot using large collections of arbitrary pixel values.

Avoid patterns such as:

top: 137px;
left: 421px;
margin-left: 23px;
padding: 17px;

when they only exist to match one screenshot.

Fixed values are acceptable when they represent real design tokens or component dimensions.

The goal is to reproduce the design system and visual relationships.

5. Spacing

Use a consistent spacing system.

Prefer:

gap
padding
margin

based on relationships.

Examples:

container padding
section spacing
card padding
control gap
text-to-icon gap
button gap

Do not add random spacing to visually force an element into position.

If multiple elements require the same spacing, prefer a shared value or existing project token.

6. Width and Height

Prefer responsive sizing.

Use:

width
max-width
min-width
height
min-height
aspect-ratio

only according to the component's actual behavior.

Avoid unnecessary:

calc()
fixed heights
fixed widths

Do not use height to compensate for incorrect alignment.

7. Typography

Match the design hierarchy.

Define visual roles such as:

page title
section title
body text
label
secondary text
metadata
button text
status text

For each role consider:

font-family
font-size
font-weight
line-height
letter-spacing
text-align

Do not create a new typography value for every element.

Reuse the existing project typography when available.

8. Colors

Use semantic color roles.

Prefer existing project variables/tokens when available:

background
surface
primary
text-primary
text-secondary
border
success
warning
error
disabled

Do not invent slightly different colors for visually similar elements.

A color should communicate a design role, not merely match one pixel from the screenshot.

9. Borders and Radius

Apply borders and corner radius consistently.

Consider:

border width
border style
border color
border radius

Related components should normally share the same visual language.

Do not introduce different radius values without a design reason.

10. Shadows

Use shadows only when the design clearly indicates elevation.

Keep them simple.

Do not stack multiple shadows to artificially reproduce a screenshot.

Prefer the project's existing elevation tokens when available.

11. Icons

Icons must be actual icons.

Never use text characters as icon replacements:

←
→
✓
✕
★
⚙

Use the existing project icon system or Font Awesome when appropriate.

If an icon is missing:

ICON_REQUIRED: <description>

Do not silently substitute an unrelated icon.

Maintain:

size
alignment
spacing
visual weight

relative to surrounding content.

12. Images

Use the correct existing project assets whenever possible.

For missing avatar images, use:

assets/img/dashbourd/avatar.jpg

as the project fallback when appropriate.

Preserve:

aspect-ratio
object-fit
border-radius
display size

according to the design.

Do not stretch images unnaturally.

Do not invent external image URLs.

13. RTL / LTR

Respect the page direction.

Prefer logical properties:

margin-inline
padding-inline
inset-inline
border-inline

when they represent the relationship correctly.

Do not create separate left/right hacks for every element.

Text alignment and directional controls must follow the actual semantic meaning.

Do not blindly mirror directional icons.

14. Buttons

Preserve action hierarchy:

primary
secondary
destructive
navigation
icon action

Style buttons consistently in:

size
padding
radius
typography
icon spacing
states

Do not use absolute positioning to place buttons.

Button groups should remain responsive.

15. Form Controls

Keep form controls visually consistent.

Consider:

height
padding
border
radius
label
placeholder
focus state
disabled state
error state

Do not style every input independently if the same visual rule applies to all controls.

Prefer reusable component-level styles when the project architecture supports them.

16. States

Implement only relevant states.

Common states:

default
hover
focus
active
disabled
selected
loading
success
warning
error

States must remain visually understandable.

Do not rely only on color when an important state needs to be communicated.

17. Responsive Styling

Responsive behavior must preserve the design intent.

Check at minimum:

large desktop
desktop
tablet
mobile-width viewport

When necessary, adjust:

spacing
font sizes
widths
visibility
wrapping
stacking

Do not create a separate CSS version of the entire page for mobile.

Prefer small targeted responsive overrides.

18. CSS Simplicity

Avoid:

- deep selector chains
- `!important`
- negative-margin hacks
- duplicate overrides
- large numbers of media queries
- unnecessary nesting
- magic-number positioning
- `style="..."` attributes or Angular `[style.*]` bindings for ordinary presentation
- introducing new CSS values when an existing design token or shared class already applies

Do not solve a local visual problem by creating a global style that can affect unrelated features.

Keep styles scoped to their component/feature unless a genuinely shared design token or rule already exists.

Do not use `!important` as a shortcut when scoped styles are sufficient.
When scoped styles are insufficient, investigate specificity; do not suppress
it with `!important`.

19. Existing Project Styles

Before creating new visual rules:

Inspect existing shared styles.
Inspect existing design tokens/variables.
Reuse existing button/input/card patterns.
Reuse existing icon conventions.
Reuse existing typography and spacing values.

Do not recreate infrastructure that already exists.

20. Visual Fidelity

The target is:

Design intent
+
Visual hierarchy
+
Consistent spacing
+
Correct typography
+
Correct colors
+
Responsive behavior

Not:

Screenshot pixels
→ arbitrary CSS values

A visually similar result that breaks responsively is not considered correct.

21. Final Check

Before finishing, verify:

Layout was not unnecessarily rewritten.
CSS is simple and scoped.
No screenshot-coordinate positioning was introduced.
Flex/Grid are used only where structurally appropriate.
Spacing is consistent.
Width/height behave responsively.
Typography hierarchy matches the design.
Colors are consistent.
Borders/radius/shadows are consistent.
Icons are real icons.
Missing icons are explicitly marked.
Existing assets are reused.
Avatar fallback is correct when needed.
RTL/LTR behavior is correct.
Buttons remain usable on narrow screens.
Form controls remain usable on narrow screens.
No unnecessary `!important` or CSS hacks were introduced.
No inline `style` attributes or Angular `[style.*]` bindings exist for ordinary presentation.
Existing design tokens and shared classes were used before introducing new values.

---

# 22. Angular Style Bindings and Class Ownership

Visual styling decisions belong in the component stylesheet or a shared
styling layer. They must not appear as inline attributes or Angular
style bindings in the template.

## Inline Style Prohibition

Do not introduce `style="..."` attributes or Angular `[style.*]` bindings
for ordinary presentation or visual state.

Acceptable exception: dynamically computed numeric values that cannot be
expressed through a CSS class (e.g., `[style.width.%]="progress"`).

## Design-Token-First Rule

Before introducing a new CSS value, check:

1. Does an existing CSS custom property / design token cover this?
2. Does an existing shared class apply?
3. Does an existing component-level rule already handle this?

Only after confirming that none of the above exists should a new value
or class be introduced.

## Class Binding Policy

Angular class bindings are not inherently wrong. They are acceptable
when they express a genuine, changing UI state and remain simple:

- `class="fixed-class"` — always valid
- `[class.active]="isSelected"` — valid for a simple boolean
- `[ngClass]="{ 'btn--loading': isSaving }"` — valid when intent is clear

Avoid:

- Complex inline conditions inside class bindings.
- Repeated identical conditions duplicated across elements.
- Large inline object literals that obscure component intent.
- Conditional classes compensating for an unclear component state model.
- Template-driven positional styling (e.g. `[class...]="i === 0"`) when native CSS pseudo-classes (`:first-child`, `:last-child`, `:nth-child`) can directly style the element.

For the authoritative class-binding and template-expression policy, see
`angular-feature-implementation` — Section 18: Template Responsibility
and Class Binding.

## Positional Selectors Over Template Logic

When visual styling varies by position in a list, grid, or flow (e.g. featured first element, border dividers, zebra striping):
- Always prefer CSS structural pseudo-classes: `:first-child`, `:last-child`, `:nth-child(...)`, `:nth-of-type(...)`.
- Never ask the template to track `$index` or calculate `i === 0` simply to attach a visual styling modifier class.

## Reuse Before Creating

Before writing a new class for an element, confirm that an existing
component class, shared utility, or design token does not already
provide the required visual rule.

Do not create a new class for every element. Reuse existing abstractions
where appropriate.
