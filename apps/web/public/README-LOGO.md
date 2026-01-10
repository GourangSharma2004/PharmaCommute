# Logo Placement Instructions

Please place your "Pharma Commute" logo image in this directory (`apps/web/public/`) with the filename:

**`pharma-commute-logo.png`**

The logo will automatically appear in the top-left corner of the sidebar.

### Supported formats:
- PNG (recommended for transparency)
- SVG (for scalable vector graphics)
- JPG/JPEG (if no transparency needed)

### Recommended dimensions:
- Width: 180-200px
- Height: Auto (maintain aspect ratio)
- Format: PNG with transparent background (as described)

If you use a different filename or format, update the `src` attribute in:
`apps/web/src/components/layout/sidebar.tsx` (line ~307)
