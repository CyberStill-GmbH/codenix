# RFC-003 — Monaco Editor Integration Specification

Version: 1.0

Status: Stable

Target

- React
- TypeScript
- @monaco-editor/react
- Existing Codenix Workspace

---

# Purpose

This document defines the complete Monaco Editor integration for the Codenix problem-solving workspace.

The AI must enhance the existing Monaco implementation instead of replacing it.

Reuse the current wrapper whenever possible.

Maintain compatibility with existing APIs, contexts, routing and architecture.

---

# Design Goals

The editor must feel responsive.

The editor must remain the visual focus.

Typing latency should be imperceptible.

No layout shifts.

No unnecessary React re-renders.

The editor should initialize only once.

Workspace state must persist.

---

# Editor Hierarchy

ProblemWorkspace

EditorPanel

EditorToolbar

MonacoContainer

MonacoEditor

StatusBar

---

# Editor Container

Height

100%

Width

100%

Padding

0

Margin

0

Overflow

hidden

Display

flex

Flex Direction

column

---

# Toolbar

Fixed Height

48px

Border Bottom

1px

Never scrolls.

Contains

Language Selector

Theme Toggle

Font Size

Word Wrap

Reset Code

Copy Code

Run

Submit

Fullscreen

Settings

---

# Monaco Region

Occupies all remaining height.

Display

flex

Flex

1

Overflow

hidden

Never use fixed heights.

---

# Monaco Initialization

The editor instance must be created once.

Store editor instance using refs.

Avoid recreating the editor when:

- language changes
- theme changes
- layout changes
- parent re-renders

---

# Editor Options

Font Family

JetBrains Mono

Font Size

14

Minimum Font Size

12

Maximum Font Size

24

Font Ligatures

true

Font Weight

400

Line Height

22

Letter Spacing

0

Cursor Style

line

Cursor Width

2

Cursor Blinking

smooth

Cursor Smooth Caret Animation

on

Mouse Wheel Zoom

false

Word Wrap

off

Automatic Layout

true

Scroll Beyond Last Line

false

Rounded Selection

true

Read Only

false

Links

true

Tab Size

4

Insert Spaces

true

Detect Indentation

true

Trim Auto Whitespace

true

Sticky Scroll

true

Bracket Pair Colorization

enabled

Guides

enabled

Folding

enabled

Code Lens

false

Minimap

disabled

Glyph Margin

false

Line Numbers

on

Render Line Highlight

line

Occurrences Highlight

true

Selection Highlight

true

Quick Suggestions

true

Parameter Hints

true

Suggest On Trigger Characters

true

Accept Suggest On Enter

smart

Inline Suggest

enabled

Snippet Suggestions

inline

Format On Paste

true

Format On Type

true

Auto Closing Brackets

always

Auto Closing Quotes

always

Auto Surround

languageDefined

Match Brackets

always

---

# Scrollbars

Vertical

visible

Horizontal

auto

Scrollbar Width

8px

Smooth Scrolling

enabled

---

# Supported Languages

Initially

C++

Java

Python

JavaScript

TypeScript

Rust

Go

C#

Kotlin

Swift

PHP

The language selector must be data-driven.

No hardcoded JSX.

---

# Starter Code

Each language provides:

Template

Default Function

Imports

Cursor Position

Starter code must be injected only once.

Never overwrite user edits automatically.

---

# Theme Support

Dark

Light

System

Theme changes must not recreate Monaco.

---

# Persistence

Persist locally:

Language

Theme

Font Size

Word Wrap

Cursor Position

Scroll Position

Opened Problem

Code Draft

Restore automatically on reload.

---

# Keyboard Shortcuts

Ctrl + Enter

Run Code

Ctrl + Shift + Enter

Submit

Ctrl + S

Save Draft

Ctrl + /

Toggle Comment

Alt + Z

Toggle Word Wrap

F11

Fullscreen

Esc

Exit Fullscreen

Ctrl + +

Increase Font Size

Ctrl + -

Decrease Font Size

Ctrl + 0

Reset Font Size

---

# Toolbar Actions

Run

Execute current code.

Submit

Submit solution.

Reset

Restore original template after confirmation.

Copy

Copy current code.

Theme

Cycle themes.

Language

Switch language.

Word Wrap

Toggle wrap.

Font Size

Increase or decrease editor font.

Fullscreen

Expand editor to entire workspace.

---

# Code Drafts

Each problem stores its own draft.

Structure

problemId

language

source

updatedAt

Drafts restore automatically.

---

# Resize Behaviour

Editor resizes automatically when:

Window resizes

Workspace resizes

Panel expands

Panel collapses

Bottom console changes height

Call

editor.layout()

after each resize.

---

# Performance Rules

Never recreate Monaco.

Use refs.

Memoize toolbar.

Memoize language selector.

Avoid unnecessary state.

Throttle expensive layout calculations.

Use requestAnimationFrame during drag.

---

# Loading

Show skeleton while Monaco loads.

Never display a blank area.

---

# Error Handling

If Monaco fails

Display fallback panel.

Allow retry.

Never crash workspace.

---

# Accessibility

Toolbar buttons

Keyboard accessible.

Language selector

ARIA compliant.

Editor

Proper labels.

Visible focus.

---

# File Structure

EditorPanel.tsx

EditorToolbar.tsx

MonacoContainer.tsx

useMonaco.ts

useEditorPersistence.ts

editorOptions.ts

languages.ts

themes.ts

shortcuts.ts

---

# Allowed Modifications

The AI MAY

Extract hooks

Extract constants

Improve performance

Split components

Improve typing

Improve responsiveness

---

# Forbidden Modifications

Do NOT

Replace Monaco

Replace @monaco-editor/react

Rewrite editor architecture

Duplicate wrappers

Hardcode languages

Hardcode themes

Destroy editor instance on every render

---

# Acceptance Checklist

- Monaco initializes only once.
- Toolbar never scrolls.
- Editor fills remaining space.
- Language changes instantly.
- Theme changes instantly.
- Drafts persist.
- Cursor position persists.
- Scroll position persists.
- Font size persists.
- Word wrap persists.
- Fullscreen works.
- Resize updates correctly.
- No typing lag.
- No editor flicker.
- No unnecessary React re-renders.
- Existing wrapper preserved.
- Existing architecture preserved.
- New code remains modular and reusable.

---

End of RFC-003