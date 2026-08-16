# RFC-002 — Codenix UI Spacing System

Version: 1.0

Status: Stable

Applies To

- Problem Workspace
- Monaco Editor
- Markdown Renderer
- Header
- Toolbar
- Bottom Console
- Tabs
- Floating Controls

---

# Purpose

This document defines the complete spacing system used throughout the Codenix problem-solving workspace.

The objective is to provide a visually balanced, professional interface with consistent spacing inspired by modern online IDEs.

The AI MUST follow these spacing values exactly.

Existing components should be modified rather than replaced.

No arbitrary spacing values may be introduced.

---

# Base Unit

The design system uses an 8px spacing grid.

Allowed spacing values:

4px

8px

12px

16px

20px

24px

32px

40px

48px

64px

Avoid values outside this scale unless explicitly defined.

---

# Root Workspace

Height

100vh

Width

100%

Padding

0

Margin

0

Gap

0

Overflow

hidden

---

# Header

Height

56px

Padding Left

16px

Padding Right

16px

Padding Top

8px

Padding Bottom

8px

Gap Between Sections

16px

Gap Between Buttons

8px

Border Bottom

1px

---

# Header Buttons

Height

36px

Minimum Width

36px

Horizontal Padding

12px

Vertical Padding

8px

Gap Between Icon and Label

8px

Border Radius

8px

Icon Size

18px

---

# Header Title

Font Size

15px

Weight

600

Margin

0

Line Height

24px

---

# Workspace Grid

Outer Gap

0

Column Gap

0

Row Gap

0

---

# Problem Panel

Padding Top

24px

Padding Bottom

32px

Padding Left

24px

Padding Right

24px

Gap Between Sections

24px

---

# Markdown Container

Width

100%

Maximum Width

900px

Margin

0

Padding

0

Gap Between Blocks

24px

---

# Headings

H1

Margin Top

32px

Margin Bottom

24px

H2

Margin Top

28px

Margin Bottom

20px

H3

Margin Top

24px

Margin Bottom

16px

Paragraph

Margin Bottom

16px

Line Height

1.75

---

# Lists

Margin Top

12px

Margin Bottom

20px

Indentation

24px

Gap Between Items

8px

---

# Inline Code

Horizontal Padding

4px

Vertical Padding

2px

Border Radius

4px

---

# Code Blocks

Margin Top

20px

Margin Bottom

24px

Padding

16px

Border Radius

10px

Header Height

36px

Copy Button Size

28px

---

# Tables

Margin Top

20px

Margin Bottom

24px

Cell Padding Horizontal

16px

Cell Padding Vertical

12px

---

# Examples

Gap Between Example Blocks

20px

Example Title Margin Bottom

12px

Code Margin Top

8px

---

# Constraints

Margin Top

24px

Margin Bottom

24px

List Gap

8px

---

# Tabs

Height

44px

Padding Left

16px

Padding Right

16px

Gap Between Tabs

20px

Indicator Height

2px

Border Bottom

1px

---

# Tab Item

Height

44px

Horizontal Padding

4px

Gap Between Icon and Text

6px

---

# Resize Handle

Visible Width

2px

Interactive Width

8px

Margin

0

Padding

0

---

# Collapse Button

Size

32px

Padding

6px

Border Radius

8px

Icon Size

18px

---

# Editor Container

Padding

0

Margin

0

Gap

0

Overflow

hidden

---

# Editor Toolbar

Height

48px

Padding Left

16px

Padding Right

16px

Gap Between Controls

12px

Border Bottom

1px

---

# Language Selector

Height

34px

Minimum Width

120px

Horizontal Padding

12px

Border Radius

8px

---

# Toolbar Buttons

Height

34px

Minimum Width

34px

Horizontal Padding

12px

Gap Between Icon and Label

6px

Border Radius

8px

Icon Size

16px

---

# Monaco Editor

Margin

0

Padding

0

Height

100%

Width

100%

No internal spacing around editor.

---

# Bottom Console

Height

240px

Padding Top

12px

Padding Bottom

12px

Padding Left

16px

Padding Right

16px

Gap Between Sections

16px

---

# Console Tabs

Height

40px

Horizontal Padding

16px

Gap Between Tabs

20px

Indicator Height

2px

---

# Console Output

Padding

16px

Line Height

1.6

Margin

0

---

# Floating Buttons

Distance From Top

16px

Distance From Right

16px

Gap

8px

Button Size

36px

Icon Size

18px

Border Radius

8px

---

# Scrollbars

Width

8px

Thumb Radius

999px

Track Width

8px

No visible borders.

---

# Cards

Internal Padding

16px

Gap Between Elements

12px

Border Radius

10px

---

# Status Badges

Horizontal Padding

8px

Vertical Padding

4px

Border Radius

999px

Gap Between Icon and Label

4px

---

# Difficulty Badge

Height

24px

Horizontal Padding

10px

Vertical Padding

4px

---

# Tags

Height

28px

Horizontal Padding

10px

Gap Between Tags

8px

Border Radius

999px

---

# SVG Icons

Default Size

18px

Small

16px

Large

20px

Maximum

24px

Icons must remain visually centered.

---

# Buttons

Primary Height

36px

Secondary Height

34px

Large Height

40px

Border Radius

8px

Horizontal Padding

14px

Vertical Padding

8px

Gap Icon/Text

6px

---

# Inputs

Height

36px

Horizontal Padding

12px

Border Radius

8px

---

# Modal

Internal Padding

24px

Gap Between Sections

20px

Border Radius

12px

---

# Animation Timing

Hover

120ms

Click

80ms

Panel Resize

Real-time

Expand

150ms

Collapse

150ms

---

# Forbidden

Do not use

5px

7px

11px

13px

17px

19px

23px

27px

Random spacing values.

Spacing must always follow this specification.

---

# Acceptance Checklist

- Every component uses the spacing scale.
- No arbitrary margins.
- No inconsistent padding.
- Buttons have identical height.
- Tabs have identical height.
- Icons remain centered.
- Markdown spacing is consistent.
- Toolbar spacing is uniform.
- Console spacing matches editor.
- Floating buttons align perfectly.
- Scrollbars remain identical.
- No component introduces custom spacing without updating this specification.

---

End of RFC-002