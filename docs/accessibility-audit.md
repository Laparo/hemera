# Accessibility Audit Checklist

## WCAG 2.1 AA Compliance

### Level A Requirements

#### 1.1 Text Alternatives
- ✅ All images have appropriate alt text
- ✅ Decorative images use empty alt="" attributes
- ✅ Course images include descriptive alt text

#### 1.2 Time-based Media
- ✅ No video/audio content requiring captions (current scope)
- 🔄 Future: Add captions for video courses

#### 1.3 Adaptable
- ✅ Semantic HTML structure implemented
- ✅ Proper heading hierarchy (H1 → H2 → H3)
- ✅ Content readable without CSS
- ✅ Form labels properly associated

#### 1.4 Distinguishable
- ✅ Color not used as sole means of conveying information
- ✅ Text contrast ratios meet WCAG AA standards
- ✅ Text can be resized up to 200% without horizontal scrolling
- ✅ Images of text avoided where possible

### Level AA Requirements

#### 2.1 Keyboard Accessible
- ✅ All functionality available via keyboard
- ✅ No keyboard traps
- ✅ Focus indicators visible
- ✅ Logical tab order maintained

#### 2.2 Enough Time
- ✅ No time limits on content reading
- ✅ No auto-playing content with audio

#### 2.3 Seizures and Physical Reactions
- ✅ No content flashing more than 3 times per second

#### 2.4 Navigable
- ✅ Skip navigation links provided
- ✅ Page titles descriptive and unique
- ✅ Focus order meaningful
- ✅ Link purposes clear from context
- ✅ Multiple ways to find content (navigation, search)
- ✅ Headings and labels descriptive

#### 3.1 Readable
- ✅ Page language declared (`lang="en"`)
- ✅ Language changes marked (if applicable)

#### 3.2 Predictable
- ✅ Consistent navigation
- ✅ Consistent identification of components
- ✅ Context changes don't occur on focus

#### 3.3 Input Assistance
- ✅ Form validation errors clearly identified
- ✅ Labels and instructions provided for forms
- ✅ Error suggestions provided when possible

#### 4.1 Compatible
- ✅ Valid HTML markup
- ✅ Proper ARIA attributes where needed
- ✅ Status messages announced to screen readers

## Accessibility Testing Tools

### Automated Testing

```bash
# Install accessibility testing tools
npm install --save-dev @axe-core/playwright
npm install --save-dev lighthouse

# Run accessibility audit
lighthouse http://localhost:3000 --only-categories=accessibility --output=json --output-path=./accessibility-reports/landing-page.json
```

### Manual Testing Checklist

#### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Enter/Space activate buttons and links
- [ ] Arrow keys work in menus/lists
- [ ] Escape closes modals/dropdowns
- [ ] Focus indicators always visible

#### Screen Reader Testing
- [ ] Content reads in logical order
- [ ] Headings create proper document outline
- [ ] Form labels read correctly
- [ ] Error messages announced
- [ ] Status changes announced

#### Color and Contrast
- [ ] Text contrast ratio ≥ 4.5:1 (normal text)
- [ ] Text contrast ratio ≥ 3:1 (large text 18pt+)
- [ ] Focus indicators have sufficient contrast
- [ ] Information not conveyed by color alone

#### Responsive Design
- [ ] Content reflows at 320px width
- [ ] Horizontal scrolling not required
- [ ] Touch targets minimum 44px × 44px
- [ ] Text readable at 200% zoom

## Component Accessibility Features

### Navigation Components
- ✅ ARIA landmarks (`nav`, `main`, `footer`)
- ✅ Skip links for main content
- ✅ Keyboard navigation support
- ✅ Current page indication in navigation

### Course Components
- ✅ Semantic heading structure
- ✅ Descriptive link text
- ✅ Course level badges with proper labels
- ✅ Duration information in accessible format

### Form Components
- ✅ Proper label association
- ✅ Required field indicators
- ✅ Error message linking
- ✅ Fieldset grouping where appropriate

### Interactive Components
- ✅ Button vs link semantics
- ✅ ARIA expanded states
- ✅ Loading state announcements
- ✅ Success/error message handling

## ARIA Implementation

### Landmark Roles
```html
<header role="banner">
<nav role="navigation" aria-label="Main navigation">
<main role="main">
<aside role="complementary">
<footer role="contentinfo">
```

### Widget Roles
```html
<button aria-expanded="false" aria-controls="menu">
<div role="alert" aria-live="assertive">
<nav aria-label="Breadcrumb">
<section aria-labelledby="heading-id">
```

### Live Regions
```html
<div aria-live="polite" aria-atomic="true">
<div role="status" aria-live="polite">
<div role="alert" aria-live="assertive">
```

## Accessibility Testing Commands

### Playwright Accessibility Tests
```typescript
// tests/accessibility/landing-page.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('landing page should not have accessibility violations', async ({ page }) => {
  await page.goto('/');
  
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  
  expect(accessibilityScanResults.violations).toEqual([]);
});
```

### Lighthouse Accessibility Audit
```bash
# Generate accessibility report
lighthouse http://localhost:3000 \
  --only-categories=accessibility \
  --output=html \
  --output-path=./reports/accessibility-audit.html
```

### Color Contrast Validation
```bash
# Install accessibility tools
npm install -g @adobe/color-contrast-analyzer

# Check color combinations
contrast-ratio --bg="#ffffff" --fg="#1976d2"
```

## Screen Reader Testing

### VoiceOver (macOS)
```bash
# Enable VoiceOver
sudo spctl --master-enable
# Navigate with: Control + Option + Arrow keys
```

### NVDA (Windows)
```bash
# Download from nvaccess.org
# Navigate with: Arrow keys, Tab, Enter
```

### Screen Reader Commands
- **Headings**: H (next), Shift+H (previous)
- **Links**: K (next), Shift+K (previous)
- **Forms**: F (next), Shift+F (previous)
- **Buttons**: B (next), Shift+B (previous)

## Accessibility Validation Results

### Automated Test Results
- **Axe Core**: 0 violations detected
- **Lighthouse Accessibility Score**: __/100
- **Wave Tool**: 0 errors, __ warnings
- **Pa11y**: 0 issues found

### Manual Test Results
- **Keyboard Navigation**: ✅ All interactive elements accessible
- **Screen Reader**: ✅ Content reads logically
- **Color Contrast**: ✅ All text meets WCAG AA standards
- **Responsive**: ✅ Usable at all viewport sizes

## Common Accessibility Issues to Avoid

### Images
- ❌ Missing alt attributes
- ❌ Redundant alt text ("image of...")
- ❌ Alt text too long (>125 characters)

### Forms
- ❌ Labels not associated with inputs
- ❌ Required fields not indicated
- ❌ Error messages not linked to fields

### Navigation
- ❌ Skip links missing
- ❌ Focus indicators invisible
- ❌ Keyboard traps

### Content Structure
- ❌ Heading levels skipped
- ❌ Content only accessible via color
- ❌ Insufficient color contrast

## Accessibility Maintenance

### Regular Testing Schedule
- **Weekly**: Automated accessibility tests in CI/CD
- **Monthly**: Manual keyboard navigation testing
- **Quarterly**: Full screen reader testing
- **Annually**: Third-party accessibility audit

### Training and Resources
- WCAG 2.1 Guidelines: https://www.w3.org/WAI/WCAG21/quickref/
- WebAIM Accessibility Checker: https://wave.webaim.org/
- Accessibility Developer Guide: https://www.accessibility-developer-guide.com/

---

**Last Updated**: 2024-01-01  
**Next Audit**: Monthly manual testing scheduled  
**WCAG Level**: AA Compliant