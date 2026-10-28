---
name: ui-mobile-layout-implementation
description: |2
   Implement an approved mobile UI specification using Ionic and simple responsive structure, preserving semantic hierarchy, touch usability, RTL/LTR behavior, and existing project architecture.
disable-model-invocation: false
---

# UI Mobile Layout Implementation

## Purpose

Convert an approved UI design specification into a clean mobile UI structure.

The target platform is:

```text
Angular + Ionic

This skill owns:

Mobile HTML structure
Ionic component selection
Mobile layout
Flexbox/Grid where appropriate
Touch-friendly sizing
Mobile spacing
RTL/LTR behavior
Mobile responsive structure

Detailed visual styling belongs to the mobile visual-styling stage.

Apply `code-naming-conventions` to any Angular component, input/output, state, event handler, configuration, or other code contract introduced during implementation. Responsive structure must not introduce generic names when the business meaning is known.

1. Start From the Design Specification

The UI design analysis is the source of truth.

Before implementation identify:

page structure
sections
component boundaries
actions
content hierarchy
direction
responsive behavior

Do not start implementation by guessing from the screenshot.

2. Mobile Is Not Desktop Made Smaller

Do not simply shrink the Web layout.

Evaluate each region:

What remains?
What stacks?
What wraps?
What becomes scrollable?
What changes interaction?
What becomes a mobile control?

Preserve the same business meaning while adapting the interaction and layout to mobile.

3. Use Ionic Components

Use Ionic components when they represent the required mobile UI behavior.

Examples:

ion-content
ion-header
ion-toolbar
ion-buttons
ion-button
ion-icon
ion-input
ion-textarea
ion-select
ion-item
ion-list
ion-card
ion-modal
ion-toggle

Do not recreate an Ionic primitive with complicated HTML/CSS.

Example:

Prefer:

<ion-button>...</ion-button>

over building a custom button from:

<div>
  <span>...</span>
</div>

when no special behavior is required.

4. Component Responsibility

Do not turn every visual element into an Angular component.

Create a component when it has:

independent responsibility
reusable behavior
repeated structure
meaningful state
complex internal UI

Otherwise keep the structure inside the owning feature component.

Follow the existing project's feature architecture.

5. Page Structure

Build from the outside inward:

Page
├── ion-header
├── ion-content
│   ├── Page sections
│   ├── Cards
│   ├── Forms
│   └── Content
└── Actions

Only use this structure when it matches the actual design.

Do not force every page into the same visual template.

6. Layout Strategy

Choose the simplest layout mechanism.

Priority:

1. Normal flow
2. Flexbox
3. CSS Grid
4. Ionic layout primitives
5. Positioning only when genuinely required

Do not use absolute positioning to reproduce screenshot coordinates.

Avoid:

top: ...
left: ...
right: ...
bottom: ...

for normal page layout.

7. Flexbox

Use Flexbox for one-dimensional relationships:

icon + text
header actions
button groups
horizontal item rows
vertical stacks

Keep the configuration simple:

display
flex-direction
align-items
justify-content
gap
flex-wrap

Avoid deeply nested Flexbox structures.

8. Grid

Use CSS Grid when the mobile design genuinely requires multiple dimensions.

Examples:

form fields
structured information
small card grids

Do not use Grid when Flexbox or normal flow is simpler.

Mobile layouts should generally become simpler, not more complicated.

9. Touch Targets

Interactive controls must remain comfortable to touch.

Pay attention to:

buttons
icons
toggles
links
list actions
navigation controls

Do not make important actions dependent on tiny clickable areas.

If an icon is the action, make the interactive container large enough while keeping the visual icon size appropriate.

10. Mobile Spacing

Use spacing based on relationships.

Prefer:

gap
padding
margin

Do not reproduce every screenshot distance as an independent magic number.

Maintain consistent spacing between:

page edges
sections
cards
controls
labels
content
actions
11. Width and Height

Mobile containers should normally use available width.

Prefer:

width: 100%
max-width
min-width: 0
min-height

when appropriate.

Avoid unnecessary fixed widths.

Avoid fixed heights for content that can grow.

Do not use height hacks to force alignment.

12. Horizontal Overflow

Prevent accidental horizontal scrolling.

Check:

long text
buttons
tables
cards
images
form controls
action groups

If content is intentionally horizontally scrollable, make that behavior explicit.

Do not solve overflow by blindly using:

overflow: hidden;

because that can hide real content.

13. RTL / LTR

Respect the application's direction.

For RTL:

text direction → RTL
content flow → RTL
logical spacing → inline properties

Prefer:

margin-inline
padding-inline
inset-inline
border-inline

instead of unnecessary left/right overrides.

Directional icons must represent their actual action.

Do not blindly mirror every icon.

14. Icons

Icons must use actual icon components/assets.

Never replace missing icons with text characters:

←
→
✓
✕
★

For Ionic, prefer:

<ion-icon ...></ion-icon>

when the required icon exists in the configured icon system.

If the exact icon is unavailable:

ICON_REQUIRED: <description>

Do not silently invent a visually unrelated icon.

15. Images

Reuse existing project assets.

When an avatar is missing, use:

assets/img/dashbourd/avatar.jpg

as the project fallback where appropriate.

Preserve the intended image behavior:

aspect-ratio
object-fit
border-radius
container size

Do not stretch images.

Do not invent external image URLs.

16. Mobile Forms

Use Ionic form controls where appropriate.

Examples:

ion-input
ion-textarea
ion-select
ion-toggle

Maintain:

label
control
validation
error message
action

relationships.

Do not make forms depend on complex absolute positioning.

Inputs should naturally resize with the viewport.

17. Mobile Actions

Actions should remain reachable and understandable.

For multiple actions:

primary
secondary
destructive
navigation

preserve their hierarchy.

If the design requires actions at the bottom of the screen, use an appropriate structural container rather than positioning them against screenshot coordinates.

If a fixed/sticky action area is genuinely required, ensure it does not cover the content.

18. Ionic Modals

Use Ionic modal infrastructure only when the design calls for a modal.

Do not turn a full-page screen into a modal simply because the desktop version used one.

Determine whether the design represents:

full page
modal
sheet
popover
dialog

and implement the appropriate interaction.

19. Mobile Navigation

Navigation controls must communicate their direction clearly.

For example:

Back
Close
Next
Menu

must remain distinguishable.

Do not replace navigation behavior with visual-only elements.

Use Ionic navigation conventions when appropriate.

20. Responsive Boundaries

Do not create many breakpoints.

Use the minimum number of breakpoints needed to preserve the design.

Typical structural changes may include:

row → column
two columns → one column
expanded actions → wrapped actions
sidebar → content

Avoid rewriting the entire component inside every breakpoint.

21. No Over-Engineering

Do not introduce:

complex layout utilities
custom positioning systems
unnecessary wrapper components
large CSS calculations
many breakpoint overrides
custom Ionic replacements

The implementation should be understandable by another engineer immediately.

22. Implementation Order

Implement in this order:

1. Page structure
2. Ionic primitives
3. Semantic hierarchy
4. Normal flow
5. Flex/Grid
6. Width constraints
7. Touch targets
8. Spacing
9. RTL/LTR
10. Responsive behavior
11. Icons
12. Images

Do not polish visual details before the structure works.

23. Final Check

Before finishing, verify:

Ionic primitives are used where appropriate.
Desktop structure was not blindly copied.
DOM hierarchy matches the mobile design.
Components have meaningful responsibilities.
No screenshot-coordinate positioning exists.
Flex/Grid are simple and justified.
No unnecessary fixed widths/heights exist.
No accidental horizontal overflow exists.
Touch targets are usable.
RTL/LTR behavior is correct.
Directional icons communicate their meaning.
Missing icons are marked instead of replaced with text.
Existing image assets are reused.
Avatar fallback is correct.
Forms use appropriate Ionic controls.
Actions remain accessible.
Modals are used only when the design requires them.
Responsive rules are minimal.
No unnecessary abstraction or CSS complexity was introduced.
