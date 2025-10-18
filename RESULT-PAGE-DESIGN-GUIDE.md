# Result Page - Visual Design Guide

## Color Palette Usage

### Primary Colors (Brand)
- **hijauterang** (#10B981 equivalent) - Primary brand green
  - Used for: Bullets, checkboxes, accents, primary buttons, links
- **hijautua** - Dark brand green
  - Used for: H1, H3 backgrounds, bold text, section headers
- **hijaumuda** - Light brand green
  - Used for: Subtle backgrounds, hover states

### Neutral Colors
- **Gray-50 to Gray-900** - Content hierarchy
  - Gray-700: Body text
  - Gray-600: Secondary text
  - Gray-100-200: Borders, dividers

## Typography Hierarchy

### Headings
```
H1 (Title)
├─ Size: 3xl (30px)
├─ Weight: Bold
├─ Color: hijautua
├─ Bottom border: 2px hijautua/20
└─ Spacing: mb-6, pb-4

H2 (Sections)
├─ Size: 2xl (24px)
├─ Weight: Semibold
├─ Color: hijauterang
├─ Left border: 4px hijauterang
└─ Spacing: mt-8, mb-5, pl-4

H3 (Subsections)
├─ Size: xl (20px)
├─ Weight: Semibold
├─ Color: hijautua
├─ Background: hijautua/5
└─ Spacing: mt-6, mb-3, px-4, py-2

H4 (Details)
├─ Size: lg (18px)
├─ Weight: Semibold
├─ Color: gray-800
└─ Spacing: mt-4, mb-2
```

### Body Text
```
Paragraphs
├─ Size: base (16px)
├─ Color: gray-700
├─ Line height: 1.8 (relaxed)
└─ Spacing: mb-4
```

## Component Styles

### Lists
```
Unordered Lists
├─ Custom bullet: • (green, large)
├─ Spacing: gap-2 between items
└─ Nested: ml-6 for sub-lists

Ordered Lists
├─ Marker color: hijauterang
├─ Marker weight: Semibold
└─ Spacing: ml-6, gap-2

Checkbox Lists
├─ Checked: ✅ Green box with white checkmark
├─ Unchecked: ☐ White box with gray border
└─ Interactive appearance
```

### Blockquotes
```
Style
├─ Left border: 4px hijauterang/80
├─ Background: hijauterang/5
├─ Padding: pl-5, pr-4, py-3
├─ Text style: Italic
├─ Shadow: sm
└─ Rounded: right side only
```

### Code Blocks
```
Inline Code
├─ Background: hijautua/10
├─ Color: hijautua
├─ Border: 1px hijautua/20
├─ Padding: px-2, py-1
└─ Font: mono

Block Code
├─ Background: gray-900
├─ Color: gray-100
├─ Padding: p-4
├─ Rounded: lg
└─ Overflow: auto
```

### Tables
```
Table Structure
├─ Container: Rounded border with shadow
├─ Header: hijauterang/10 background
├─ Borders: gray-200
├─ Cell padding: px-6, py-3 (header), px-6, py-4 (body)
└─ Responsive: Horizontal scroll
```

### Links
```
Link Style
├─ Color: hijauterang
├─ Underline: Offset 4px
├─ Hover: hijautua with full opacity underline
├─ Target: _blank for external
└─ Transition: All colors
```

## Layout Structure

### Main Container
```
Analysis Result Section
├─ Background: Gradient white to gray-50/50
├─ Border: gray-100
├─ Shadow: inner
├─ Padding: p-6 lg:p-8
└─ Rounded: 2xl
```

### Content Flow
```
Page Structure
├─ Header (Document info)
│   ├─ Title with status
│   ├─ Metadata badges
│   └─ Action buttons
│
├─ Main Content (2-column on lg)
│   ├─ Analysis Results (Left, wider)
│   │   ├─ Search badges
│   │   ├─ Metadata cards
│   │   └─ Markdown content
│   │
│   └─ Sidebar (Right, narrower)
│       ├─ Document summary
│       └─ Chat interface
│
└─ Action Cards (Recommendations)
```

## Spacing System

### Margins
```
Element Relationships
├─ H1 first: mt-0
├─ H2 sections: mt-8, mb-5
├─ H3 subsections: mt-6, mb-3
├─ H4 details: mt-4, mb-2
├─ Paragraphs: mb-4
├─ Lists: my-4
├─ Blockquotes: my-4
├─ Code blocks: my-4
├─ Tables: my-6
└─ HR dividers: my-8
```

### Padding
```
Content Padding
├─ Main container: p-6 lg:p-8
├─ Cards: p-4 to p-6
├─ Blockquotes: pl-5, pr-4, py-3
├─ Code inline: px-2, py-1
├─ Code block: p-4
└─ Table cells: px-6, py-3/4
```

## Responsive Behavior

### Breakpoints
```
Mobile (default)
├─ Single column layout
├─ Full width content
├─ Reduced padding
└─ Stacked elements

Tablet/Desktop (lg:)
├─ 2-column grid
├─ Increased padding
├─ Side-by-side layout
└─ Enhanced spacing
```

## Special Features

### Priority Indicators
```
Visual Markers
├─ ⚠️ Kritis (Critical) - Red/warning
├─ ⚡ Penting (Important) - Yellow/attention
└─ ℹ️ Opsional (Optional) - Blue/info
```

### Status Badges
```
Badge Styles
├─ Background: hijauterang/10
├─ Text: hijautua
├─ Dot indicator: hijauterang
├─ Padding: px-3, py-1.5
└─ Rounded: full
```

### Interactive Elements
```
Buttons
├─ Primary: bg-hijauterang, white text
├─ Secondary: border-hijautua, hijautua text
├─ Hover: Scale transform or bg change
└─ Disabled: Opacity 60%, no transform
```

## Accessibility Features

### Contrast
- All text meets WCAG AA standards
- Color is not the only indicator
- Clear visual hierarchy

### Semantic HTML
- Proper heading hierarchy (h1 → h2 → h3)
- Semantic lists (ul, ol)
- Meaningful link text
- Table headers properly marked

### Screen Readers
- Alternative text for icons
- ARIA labels where needed
- Proper link descriptions
- Semantic structure

## Print Styles (Future)
```
Recommendations for Print CSS
├─ Remove backgrounds
├─ Black text on white
├─ Page break controls
├─ Simplified borders
└─ Optimized margins
```

---

This design guide ensures consistent styling across the result page and provides a reference for future updates or similar components.
