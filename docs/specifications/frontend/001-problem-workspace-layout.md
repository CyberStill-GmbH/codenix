# RFC-001 — Codenix Problem Workspace Layout Specification

Version: 1.0

Status: Stable

Target Stack

- React 19
- TypeScript
- TailwindCSS
- Monaco Editor
- React Markdown
- Existing modular architecture

---

# Purpose

This document defines the complete workspace layout specification for the Codenix problem-solving interface.

The implementation goal is to reproduce the usability, spatial organization, responsiveness and workflow of LeetCode's coding workspace while keeping Codenix's own branding and existing architecture.

This specification is intended for AI-assisted development.

The AI MUST modify the current implementation instead of rebuilding it.

The AI MUST preserve:

- existing routing
- existing API calls
- existing hooks
- existing contexts
- existing components whenever possible

Only refactor components strictly necessary to satisfy this specification.

---

# Primary UX Goals

The workspace should feel like a professional online IDE.

The user should never feel lost.

Every interaction must require the minimum number of clicks.

Panel movement must feel fluid.

The editor must remain the visual focus.

No layout jumps are acceptable.

No unnecessary animations.

No delayed resizing.

No layout flashing.

---

# General Layout

The workspace is composed of four regions.

```

┌──────────────────────────────────────────────────────────────┐
│ Header                                                       │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ Problem Panel │ Monaco Editor                               │
│               │                                             │
│               │                                             │
│               │                                             │
│               │                                             │
│               │                                             │
│               │                                             │
├───────────────┴──────────────────────────────────────────────┤
│ Bottom Panel                                                 │
└──────────────────────────────────────────────────────────────┘

```

---

# Layout Rules

Use CSS Grid.

Do NOT build the workspace using nested Flex containers.

Grid must remain stable during resize.

The layout should never reflow unexpectedly.

Grid areas:

Header

Workspace

BottomPanel

---

# Initial Dimensions

Workspace Height

100vh

Header Height

56px

Workspace

remaining available height

Bottom Panel

240px

Problem Panel

44%

Editor Panel

56%

---

# Grid Structure

Root

```

display:grid;

grid-template-rows:

56px

1fr

240px

```

Workspace

```

display:grid;

grid-template-columns:

44%

8px

56%

```

---

# Header

Header is fixed.

Header never scrolls.

Height

56px

Width

100%

Sticky

top:0

z-index above editor.

---

# Workspace

Workspace occupies all remaining height.

No vertical overflow.

Only internal panels may scroll.

Never allow body scrolling.

```

html

overflow:hidden

body

overflow:hidden

```

---

# Left Panel

Contains:

Problem Description

Examples

Constraints

Notes

Hints

Editorial

Solutions

Submissions

Discussion

The panel owns its own scroll.

Scrolling this panel never affects Monaco.

---

# Right Panel

Contains only:

Toolbar

Monaco

Floating Controls

The editor always fills remaining available space.

---

# Bottom Panel

Contains

Console

Test Result

Accepted

Wrong Answer

Compilation Errors

Runtime Errors

Execution Time

Memory Usage

The Bottom Panel owns its own scrolling.

---

# Resize Handles

Two resize handles exist.

Horizontal

between

Problem

Editor

Vertical

between

Editor

Bottom Panel

---

# Horizontal Resize

Width

8px

Cursor

col-resize

Active Area

8px

Visual Area

2px

Hover

Background slightly brighter.

Active

Background highlighted.

Resize must update immediately.

Never debounce dragging.

Use requestAnimationFrame.

---

# Vertical Resize

Height

8px

Cursor

row-resize

Same interaction rules.

---

# Resize Limits

Problem Panel

Minimum

320px

Maximum

65%

Editor

Minimum

420px

Bottom Panel

Minimum

140px

Maximum

60%

---

# Collapse Behaviour

If Problem Panel width becomes smaller than

80px

automatically collapse.

Collapsed state

Only display

Collapse SVG Icon

Expand Button

No markdown.

No tabs.

No scrollbar.

---

# Expand Behaviour

Click

or

Drag

expands panel.

Restore previous width.

---

# Dynamic Layout

Workspace remembers:

Problem Width

Bottom Height

Collapsed State

Current Tab

Editor Font Size

Selected Language

Word Wrap

Theme

Restore automatically.

---

# Fullscreen Mode

Editor fullscreen hides

Problem

Bottom Panel

Workspace becomes

100%

ESC exits fullscreen.

---

# Header Behaviour

Header never changes height.

Header never shrinks.

Header remains visible while scrolling.

---

# Scrolling Rules

Problem panel

Independent scrolling.

Editor

Independent scrolling.

Bottom Panel

Independent scrolling.

No synchronized scrolling.

---

# Focus Behaviour

Click editor

Focus Monaco.

Dragging panels

Never steals editor state.

Running code

Editor keeps focus.

---

# Performance Requirements

Dragging

60 FPS.

No React re-render during resize.

Use refs.

Use requestAnimationFrame.

Use CSS variables.

Avoid React state updates every mouse move.

---

# Accessibility

Every resize handle

ARIA label

Keyboard accessible

Focusable

Minimum touch target

32px

---

# Responsive Behaviour

Desktop

Three-panel layout.

Laptop

Three-panel layout.

Tablet

Problem collapses by default.

Mobile

Editor occupies full width.

Bottom panel becomes drawer.

---

# Component Hierarchy

ProblemWorkspace

WorkspaceHeader

WorkspaceBody

ProblemPanel

ResizeHandleHorizontal

EditorPanel

ResizeHandleVertical

BottomPanel

WorkspaceOverlay

---

# Allowed Modifications

The AI MAY

Refactor JSX

Extract Components

Extract Hooks

Improve Layout

Optimize Rendering

Improve Responsiveness

Add Context

Add Utility Hooks

---

# Forbidden Modifications

Do NOT

Rewrite routing

Rewrite authentication

Rewrite APIs

Rewrite Monaco wrapper

Replace Tailwind

Replace React

Replace architecture

Remove modularity

Hardcode dimensions inside components

Duplicate components

---

# Acceptance Checklist

- Header always visible.
- No body scrolling.
- Workspace fills viewport.
- Independent scrolling.
- Horizontal resize works.
- Vertical resize works.
- Resize remains smooth.
- Collapse works.
- Expand works.
- Restore width works.
- LocalStorage persists layout.
- Fullscreen works.
- Monaco never loses focus.
- No layout jumping.
- No flickering.
- No unnecessary re-renders.
- Existing architecture preserved.
- Existing components reused whenever possible.
- New code follows existing project conventions.
- Visual proportions closely resemble the LeetCode workspace without copying proprietary assets or source code.

---

End of RFC-001