# RFC-011 — User Navigation, Profile Menu & Settings

Version: 1.0

Status: Stable

Target

- Navbar
- User Dropdown
- User Settings
- Responsive Navigation

Depends On

- RFC-002 UI Spacing
- RFC-006 Design Tokens

---

# Purpose

This RFC defines the complete behavior of the authenticated navigation system of Codenix.

The current implementation is functional but requires improvements in:

- responsiveness
- positioning
- accessibility
- animations
- consistency
- component reuse

The AI MUST enhance the existing implementation.

Do NOT replace the navbar.

Do NOT rewrite routing.

Reuse existing components whenever possible.

---

# Main Goals

Create a navigation experience similar in quality to modern developer platforms such as GitHub, Vercel, Linear and LeetCode.

The navigation should feel lightweight, responsive and consistent.

---

# Navbar

Navbar Height

56px

Sticky

Top

Always visible.

Contains

Logo

Primary Navigation

Search

Notifications (future)

Profile Avatar

Everything vertically centered.

---

# Navigation Links

Desktop

Problems

Submissions

Profile

Future

Contests

Progress

Admin (role based)

Spacing

24px

Active indicator

Bottom border

2px

Transition

150ms

---

# Search

Desktop Width

360px

Tablet

260px

Mobile

Hidden

Replaced by search button.

Shortcut

Ctrl + K

Future implementation.

---

# Avatar

Desktop

40px

Tablet

40px

Mobile

36px

Circular

Always aligned to navbar.

Clickable area

44px minimum.

---

# Profile Dropdown

Desktop Width

320px

Border Radius

14px

Internal Padding

8px

Shadow

Soft

Background

Panel Surface

Border

1px

Must open aligned to avatar.

Never overflow viewport.

Automatically reposition if close to screen edges.

---

# Dropdown Header

Contains

Avatar

Name

Username

Optional Bio

Current Rating (future)

Solved Problems (future)

Layout

Horizontal

Gap

16px

Avatar

56px

Name

16px

Weight

600

Username

14px

Secondary color

---

# Navigation Items

Profile

Progress

Submissions

Settings

Divider

Logout

Each item

Height

44px

Padding Left

16px

Padding Right

16px

Gap

12px

Icon

18px

Border Radius

8px

Hover

Background Surface Hover

Transition

120ms

Cursor

Pointer

Entire row clickable.

---

# Logout

Always separated.

Danger color.

Icon and label aligned.

Confirmation dialog before logout.

---

# Dropdown Animation

Opening

Opacity

0 → 1

TranslateY

-8px → 0

Duration

120ms

Ease Out

Closing

Reverse animation.

---

# Click Outside

Clicking outside

Closes dropdown.

Escape

Closes dropdown.

Opening another overlay

Automatically closes dropdown.

---

# Responsive Behavior

Desktop

Floating dropdown.

Tablet

Floating dropdown with adaptive width.

Mobile

Bottom Sheet

Full width.

Rounded top corners.

Safe area support.

No floating dropdown on mobile.

---

# Settings Page

Create a dedicated Settings page.

Reuse existing layout.

Do not create a modal.

---

# Settings Layout

Two-column layout.

Left

Settings Navigation

Right

Settings Content

Desktop

Sidebar

280px

Content

Remaining width

Tablet

240px sidebar

Mobile

Sidebar becomes drawer.

---

# Settings Sections

General

Appearance

Editor

Notifications

Security

Account

Future

Integrations

API Keys

Sessions

Privacy

---

# General

Preferred Language

Timezone

Country

Display Name

---

# Appearance

Theme

Light

Dark

System

Accent Color (future)

Compact Mode (future)

---

# Editor

Font Size

Word Wrap

Tab Size

Font Family

Ligatures

Cursor Animation

Restore Defaults

These settings should reuse Monaco preferences.

---

# Notifications

Email Notifications

Contest Reminders

Submission Results

Product Updates

Future only.

---

# Security

Change Password

Active Sessions

Two Factor Authentication (future)

Login History (future)

---

# Account

Avatar

Display Name

Username

Email

Delete Account (future)

---

# Persistence

Settings must persist.

Reuse existing backend APIs if available.

Otherwise

Use localStorage until backend support exists.

---

# Accessibility

Keyboard navigation.

ARIA labels.

Visible focus.

Escape closes overlays.

Tab navigation.

---

# Components

Navbar

NavbarSearch

NavbarAvatar

ProfileDropdown

ProfileDropdownHeader

ProfileDropdownItem

SettingsLayout

SettingsSidebar

SettingsSection

SettingsCard

AppearanceSettings

EditorSettings

SecuritySettings

AccountSettings

---

# Allowed Changes

Improve positioning.

Improve responsiveness.

Extract reusable components.

Improve animations.

Reuse existing routing.

Reuse existing services.

Reuse existing authentication.

---

# Forbidden Changes

Do NOT

Rewrite authentication.

Replace routing.

Duplicate user state.

Create multiple dropdown implementations.

Hardcode user information.

Break existing APIs.

---

# Acceptance Checklist

Navbar remains fixed.

Avatar always aligned.

Dropdown never overflows viewport.

Dropdown closes on outside click.

Dropdown closes with Escape.

Mobile uses Bottom Sheet.

Desktop uses floating menu.

Settings page is responsive.

Settings reuse Monaco preferences.

No duplicated navigation components.

Existing authentication preserved.

Existing APIs preserved.

Existing architecture preserved.

All navigation components are reusable.

---

End of RFC-011