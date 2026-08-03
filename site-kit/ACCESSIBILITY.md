# Accessibility

## Baseline requirements

- Semantic landmarks for header, navigation, main, sections, and footer
- Keyboard access for every interactive element
- Visible focus state
- Accessible names for icon-only controls
- Sufficient text and control contrast
- Reduced-motion support
- Error text connected to its related control
- Status changes announced where necessary

## Media controls

For SleepyRadio:

- use native button elements for play, pause, favorite, and timer controls
- expose current playback state through text and ARIA state
- do not rely on color alone
- maintain a predictable tab order
- keep the persistent player reachable by keyboard
- announce stream failures without repeatedly stealing focus
- ensure volume and timer controls have labels and numeric values

## Images

- Organization marks should use concise alt text.
- Decorative station art should use empty alt text when the station name is adjacent.
- Avoid using untrusted station images as meaningful text substitutes.

## Forms and search

- Every input needs a label, even when a placeholder is present.
- Search result counts should be available to assistive technology.
- Filter changes should not unexpectedly move focus.
