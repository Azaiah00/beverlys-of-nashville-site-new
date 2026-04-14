# Cursor / Claude Prompt — Porting HTML Products to Portal Modules

Paste the block below into Cursor (or a new Claude conversation) along with the
target HTML file. It's been tuned to produce a React module that matches the
existing portal system so routing, auth, progress tracking, and upsell all work
out of the box.

---

## Prompt

> I'm porting an interactive HTML product from Beverly's of Nashville into a
> React module inside the Academy Portal. Use `MasterColoristsCheatSheet.tsx` as
> the reference pattern (same file layout, styling tokens, portal chrome, and
> progress hook).
>
> **Requirements:**
> 1. Output a single `.tsx` file at `client/src/pages/portal/products/<Name>.tsx`
> 2. Wrap in `<PortalLayout>` from `@/components/PortalLayout`
> 3. Use the design tokens: `GOLD = "#C9A84C"`, `GOLD_DARK = "#A8883A"`, `CHARCOAL = "#1A1A1A"`, `Georgia` serif for headings, `Lato` sans for body
> 4. Lessons render as `<LessonShell>` with numbered `01 / 02 / ...` headers and a "Mark complete" button
> 5. Wire progress tracking via the `progress` Supabase table using the pattern from `MasterColoristsCheatSheet.tsx` — `product_slug` matches the slug in `client/src/lib/products.ts`, each lesson gets a `lesson_id`
> 6. Preserve every interactive widget from the source HTML (sliders, pickers, quizzes, calculators, decision trees) as idiomatic React components using `useState` — do NOT embed the original `<script>` tags verbatim
> 7. Preserve the original copy word-for-word wherever Teddy is speaking directly (voice is the product)
> 8. End the module with a gold-bordered upsell card linking to `/pricing` when the current product is not the top tier
> 9. Add the route in `App.tsx` as:
>    ```tsx
>    <Route path="/portal/products/<slug>">
>      {() => <ProtectedRoute requireProduct="<slug>"><MyModule /></ProtectedRoute>}
>    </Route>
>    ```
> 10. Import and use `lucide-react` icons — never inline SVGs
>
> **What NOT to do:**
> - Do not use Tailwind utility classes — this portal uses inline `style={{}}` to match the existing pattern
> - Do not copy `<style>` blocks from the HTML — rewrite as inline styles
> - Do not add any top-level `<nav>`, `<header>`, `<footer>` — `PortalLayout` handles chrome
> - Do not create new pricing tiers or catalog entries — only reference slugs that already exist in `client/src/lib/products.ts`
>
> Source HTML attached below. Produce the complete `.tsx` file, ready to drop in.
>
> ```html
> [paste HTML product here]
> ```

---

## Product slugs & tiers (already wired in `lib/products.ts`)

| HTML file                           | Slug                         | Required tier |
|-------------------------------------|------------------------------|---------------|
| 01-Master-Colorists-Cheat-Sheet     | master-colorists-cheat-sheet | free ✅ done  |
| 02-Silk-Press-Blueprint             | silk-press-blueprint         | apprentice    |
| 03-Hair-Color-Mastery-Guide         | hair-color-mastery-guide     | artisan       |
| 04-Curl-Pattern-Decoder             | curl-pattern-decoder         | apprentice    |
| 05-Chair-Confidence                 | chair-confidence             | artisan       |
| 06-Consultation-Vault               | consultation-vault           | artisan       |
| 07-Salon-Owner-Playbook             | salon-owner-playbook         | master        |

## Post-port checklist

- [ ] File created at `client/src/pages/portal/products/<Name>.tsx`
- [ ] Route added to `client/src/App.tsx`
- [ ] Ran `pnpm dev` and clicked through every lesson end-to-end
- [ ] "Mark complete" persists after refresh (check Supabase `progress` table)
- [ ] Admin account sees the module regardless of tier
- [ ] Non-subscriber sees `/pricing` redirect when tier doesn't match

## Pro tip

If the HTML product has a particularly gnarly widget (e.g. a physics-simulated
curl pattern visualizer), extract it into its own file under
`client/src/pages/portal/products/widgets/<Name>.tsx` to keep the main module
readable.
