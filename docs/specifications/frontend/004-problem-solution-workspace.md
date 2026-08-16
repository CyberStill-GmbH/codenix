# RFC-004 — Problem Solution Workspace Specification

Version: 1.0

Status: Stable

Depends On

- RFC-001 Workspace Layout Specification
- RFC-002 UI Spacing System
- RFC-003 Monaco Editor Integration

Target Stack

- React
- TypeScript
- TailwindCSS
- Monaco Editor
- React Markdown
- Existing Codenix Architecture

---

# Purpose

This RFC defines the complete behavior of the Codenix problem-solving workspace.

The goal is to deliver a professional coding environment comparable in usability and workflow to modern online coding platforms while preserving Codenix's modular architecture and visual identity.

The AI MUST modify existing components whenever possible.

The AI MUST NOT rebuild the workspace from scratch.

---

# Main Objective

The workspace should behave as a single integrated application instead of multiple independent components.

The user should never notice boundaries between:

- Header
- Markdown
- Monaco
- Console
- Submission Results
- Test Cases

Everything should feel connected.

---

# Workspace Composition

ProblemWorkspace

├── WorkspaceHeader

├── WorkspaceLayout

│ ├── ProblemPanel

│ ├── ResizeHandleHorizontal

│ ├── EditorPanel

│ ├── ResizeHandleVertical

│ └── BottomPanel

└── FloatingControls

---

# User Flow

User opens problem

↓

Problem metadata requested

↓

Markdown rendered

↓

Starter code loaded

↓

Previous draft restored

↓

Previous language restored

↓

Previous layout restored

↓

Workspace becomes interactive

---

# Problem Panel

Contains

Description

Examples

Constraints

Hints

Notes

Editorial

Solutions

Submissions

Discussion

The panel scrolls independently.

Changing tabs never reloads Monaco.

---

# Editor Panel

Contains

Toolbar

↓

Monaco

↓

Status Bar

Toolbar never scrolls.

Editor always fills remaining height.

Status bar remains fixed.

---

# Bottom Panel

Contains

Test Cases

↓

Output

↓

Runtime

↓

Memory

↓

Accepted

↓

Wrong Answer

↓

Compilation Errors

↓

Custom Input

Each section is rendered using reusable components.

---

# Workspace State

Workspace state includes

Current Problem

Current Language

Current Theme

Current Draft

Cursor Position

Scroll Position

Problem Width

Bottom Height

Collapsed State

Word Wrap

Font Size

Active Tab

Submission State

Execution State

Loading State

---

# State Management

Prefer Context API.

Avoid prop drilling.

WorkspaceContext

↓

EditorContext

↓

SubmissionContext

↓

ProblemContext

Each context should expose only required state.

---

# Problem Loading

Loading must be asynchronous.

Show skeleton placeholders.

Do not block editor initialization.

Markdown and Monaco should load independently.

---

# Starter Code

Starter code should be injected only if

No draft exists.

Changing tabs must never reset code.

Changing theme must never reset code.

Changing layout must never reset code.

---

# Draft Persistence

Each problem maintains an independent draft.

Changing language stores separate drafts.

Example

Problem 12

Python Draft

Rust Draft

Go Draft

All restored independently.

---

# Language Switching

Switch language

↓

Save current draft

↓

Load target draft

↓

If draft missing

Load starter template

Never lose code.

---

# Run Flow

User presses Run

↓

Validate editor content

↓

Send execution request

↓

Disable Run button

↓

Show loading indicator

↓

Receive execution

↓

Populate console

↓

Enable Run button

Editor remains editable.

---

# Submit Flow

User presses Submit

↓

Validate editor

↓

Submit solution

↓

Receive verdict

↓

Render result

↓

Update submission history

↓

Refresh statistics

---

# Bottom Panel Behaviour

During execution

Automatically open console.

Compilation Error

Focus Output tab.

Wrong Answer

Focus Test Case tab.

Accepted

Focus Result tab.

---

# Console Tabs

Test Cases

Custom Input

Output

Runtime

Memory

Submission History

Console remembers last active tab.

---

# Fullscreen Mode

Hide

Problem Panel

Bottom Panel

Workspace expands editor to full viewport.

Escape restores previous layout.

---

# Resize Behaviour

Horizontal resize

Realtime.

Vertical resize

Realtime.

Both persisted automatically.

---

# Collapse Behaviour

Dragging problem panel below threshold

↓

Collapse automatically

↓

Show only expand icon

↓

Restore previous width after expansion

---

# Floating Controls

Workspace includes

Collapse

Fullscreen

Theme

Settings

Always positioned consistently.

Never overlap Monaco suggestions.

---

# Keyboard Shortcuts

Ctrl + Enter

Run

Ctrl + Shift + Enter

Submit

Ctrl + /

Toggle Comment

Ctrl + S

Save Draft

Alt + Z

Word Wrap

F11

Fullscreen

Escape

Exit Fullscreen

---

# Error Handling

Network failure

↓

Display retry panel.

Markdown failure

↓

Display fallback.

Execution failure

↓

Display execution error.

Workspace should never crash.

---

# Performance Requirements

Monaco initialized once.

Markdown memoized.

Toolbar memoized.

Tabs memoized.

Resize handled using requestAnimationFrame.

Avoid unnecessary renders.

Prefer refs during drag.

---

# Accessibility

Keyboard navigation across workspace.

Visible focus.

ARIA labels.

Resizable handles accessible.

Buttons accessible.

Color contrast compliant.

---

# Component Responsibilities

WorkspaceHeader

Navigation and actions.

ProblemPanel

Markdown rendering only.

EditorToolbar

Editor actions only.

EditorPanel

Editor container only.

BottomPanel

Execution feedback only.

WorkspaceContext

Global workspace state.

No component should own unrelated logic.

---

# API Integration

Workspace consumes existing backend APIs.

Do not modify endpoints.

Do not modify payload contracts.

Do not duplicate API logic.

Existing services must be reused.

---

# Design Consistency

Must follow

RFC-001

Workspace Layout

RFC-002

Spacing System

RFC-003

Monaco Integration

No visual implementation may contradict these specifications.

---

# Forbidden Changes

Do NOT

Rewrite routing.

Rewrite authentication.

Replace Monaco.

Replace Markdown renderer.

Duplicate contexts.

Duplicate hooks.

Hardcode API data.

Break modularity.

Ignore existing architecture.

---

# Acceptance Checklist

Layout persists across sessions.

Independent scrolling works.

Monaco never reinitializes unnecessarily.

Markdown never causes layout jumps.

Toolbar remains fixed.

Console behaves independently.

Problem drafts persist.

Language drafts persist.

Run flow completes without losing focus.

Submit flow updates results correctly.

Resize is smooth.

Collapse behaves correctly.

Fullscreen behaves correctly.

Keyboard shortcuts function correctly.

Workspace remains responsive.

Existing architecture preserved.

Existing APIs preserved.

Existing modular structure preserved.

Workspace feels cohesive and professional.

No unnecessary visual differences between components.

Performance remains stable under prolonged usage.

---

# Definition of Done

The implementation is complete only if:

- The workspace behaves as a single cohesive IDE.
- Every interaction is smooth and predictable.
- Existing project architecture remains intact.
- All four RFC documents are respected simultaneously.
- The resulting workspace is production-ready, maintainable and modular.

---

End of RFC-004