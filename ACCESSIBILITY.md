# Accessibility Guide

## Overview
PIDE Protocol is committed to WCAG 2.1 Level AAA compliance, ensuring the application is usable by everyone, including people with disabilities.

## Implemented Features

### Semantic HTML
- **Proper Heading Hierarchy**: h1 → h2 → h3 structure
- **Landmark Regions**: header, nav, main, footer, aside
- **Lists**: Proper ul/ol for navigation and content
- **Tables**: Proper table structure with headers

### ARIA Attributes
- **Roles**: Complementary roles where needed
- **Labels**: aria-label for icon-only buttons
- **Live Regions**: aria-live for dynamic content
- **Hidden Content**: aria-hidden for decorative elements
- **Descriptions**: aria-describedby for additional context

### Keyboard Navigation
- **Tab Order**: Logical tab sequence
- **Focus Indicators**: Visible focus styles (2px white outline)
- **Skip Links**: Jump to main content
- **Keyboard Shortcuts**: Standard shortcuts supported
- **Focus Management**: Proper focus on modals/dialogs

### Screen Reader Support
- **Alt Text**: Descriptive alt text for images
- **Link Context**: Meaningful link text
- **Form Labels**: Proper label associations
- **Error Messages**: Clear error descriptions
- **Status Updates**: Announced via aria-live

### Visual Accessibility
- **Color Contrast**: WCAG AAA (7:1 for normal text, 4.5:1 for large)
- **Focus Visible**: High contrast focus indicators
- **Text Sizing**: Responsive text scales properly
- **Zoom Support**: Works up to 200% zoom
- **Dark Mode**: Full dark mode support

### Motion & Animation
- **Reduced Motion**: Respects prefers-reduced-motion
- **Animation Control**: Animations can be disabled
- **No Auto-play**: No auto-playing content
- **Pause Controls**: User control over animations

## Testing Checklist

### Automated Testing
- [ ] axe DevTools (0 violations)
- [ ] Lighthouse Accessibility (100 score)
- [ ] WAVE (0 errors)
- [ ] Pa11y (0 errors)

### Manual Testing
- [ ] Keyboard-only navigation
- [ ] Screen reader testing (NVDA, JAWS, VoiceOver)
- [ ] Zoom to 200%
- [ ] High contrast mode
- [ ] Reduced motion preference
- [ ] Color blindness simulation

### Screen Readers
- **NVDA** (Windows): Free, widely used
- **JAWS** (Windows): Industry standard
- **VoiceOver** (macOS/iOS): Built-in
- **TalkBack** (Android): Built-in
- **Orca** (Linux): Free, open source

## WCAG 2.1 Compliance

### Level A (Must Have)
✅ Text alternatives for non-text content
✅ Captions for audio/video
✅ Adaptable content structure
✅ Distinguishable content
✅ Keyboard accessible
✅ Enough time to read/use
✅ No seizure-inducing content
✅ Navigable structure
✅ Input assistance

### Level AA (Should Have)
✅ Live captions for live audio
✅ Audio description for video
✅ Color contrast (4.5:1)
✅ Resize text (200%)
✅ Images of text avoided
✅ Multiple ways to navigate
✅ Headings and labels
✅ Focus visible
✅ Language of page
✅ On input changes
✅ Error identification
✅ Labels or instructions
✅ Error suggestions

### Level AAA (Nice to Have)
✅ Sign language for audio
✅ Extended audio description
✅ Media alternative for video
✅ Color contrast (7:1)
✅ No images of text
✅ Low background audio
✅ Visual presentation control
✅ Unusual words explained
✅ Abbreviations explained
✅ Reading level (lower secondary)
✅ Pronunciation provided
✅ Location information
✅ Section headings
✅ Link purpose from text
✅ Multiple ways to navigate
✅ Focus order
✅ Context-sensitive help
✅ Error prevention

## Common Patterns

### Buttons
```tsx
// Good: Accessible button
<button
  onClick={handleClick}
  aria-label="Close dialog"
  className="focus:outline-2 focus:outline-white"
>
  <X className="w-5 h-5" aria-hidden="true" />
</button>

// Bad: Inaccessible button
<div onClick={handleClick}>
  <X />
</div>
```

### Links
```tsx
// Good: Descriptive link
<a href="/docs" aria-label="Read PIDE Protocol documentation (opens in new tab)">
  Read Docs
  <ExternalLink aria-hidden="true" />
</a>

// Bad: Generic link
<a href="/docs">Click here</a>
```

### Forms
```tsx
// Good: Accessible form
<label htmlFor="email">Email Address</label>
<input
  id="email"
  type="email"
  aria-required="true"
  aria-describedby="email-error"
/>
<span id="email-error" role="alert">
  {error}
</span>

// Bad: Inaccessible form
<input type="email" placeholder="Email" />
```

### Images
```tsx
// Good: Descriptive alt text
<img
  src="/hero.png"
  alt="PIDE Protocol dashboard showing verified gaming credentials"
/>

// Decorative image
<img src="/pattern.png" alt="" aria-hidden="true" />

// Bad: Missing alt
<img src="/hero.png" />
```

### Modals
```tsx
// Good: Accessible modal
<Dialog
  open={isOpen}
  onOpenChange={setIsOpen}
  aria-labelledby="dialog-title"
  aria-describedby="dialog-description"
>
  <DialogTitle id="dialog-title">Confirm Action</DialogTitle>
  <DialogDescription id="dialog-description">
    Are you sure you want to proceed?
  </DialogDescription>
</Dialog>
```

## Tools & Resources

### Browser Extensions
- **axe DevTools**: Automated accessibility testing
- **WAVE**: Visual accessibility evaluation
- **Lighthouse**: Performance and accessibility audits
- **Color Contrast Analyzer**: Check color ratios

### Testing Tools
- **Pa11y**: Automated accessibility testing
- **axe-core**: Accessibility testing engine
- **jest-axe**: Jest integration for axe
- **Storybook a11y addon**: Component accessibility testing

### Design Tools
- **Stark**: Figma plugin for accessibility
- **Contrast**: macOS app for color contrast
- **Color Oracle**: Color blindness simulator
- **NoCoffee**: Vision impairment simulator

### Documentation
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [A11y Project](https://www.a11yproject.com/)
- [WebAIM](https://webaim.org/)

## Continuous Improvement

### Regular Audits
- Monthly automated testing
- Quarterly manual testing
- Annual third-party audit
- User feedback integration

### Training
- Team accessibility training
- Design system documentation
- Code review checklist
- Accessibility champions

### User Testing
- Include users with disabilities
- Test with assistive technologies
- Gather feedback regularly
- Iterate based on findings

## Support
For accessibility issues or questions:
- Email: accessibility@pide.protocol
- GitHub: Open an issue with [A11Y] tag
- Discord: #accessibility channel
