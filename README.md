*Looking for a shareable component template? Go here --> [sveltejs/component-template](https://github.com/sveltejs/component-template)*

---

# svelte app

This is a project template for [Svelte](https://svelte.dev) apps. It lives at https://github.com/sveltejs/template.

# Notes

- Can't get animations on Materialify Cards due to this: https://stackoverflow.com/questions/66056367/svelte-with-snowpack-gives-not-implemented-animation-when-trying-to-import-tr
- `flip` animation requires reordering of current JSON object, **not** recreating a new sorted object. (Subtle bug?)
- In general, a too low abstraction level for my preferred workflow. Full control, but requires a lot of fiddling around.

## Improvements

- Better griding, for all screen sizes

# TODO

- Export code to `docs` rather than public
- Cleanup
  - Include all packages in packages.json
- Write a brief README
  - Explain dashboard motivation
  - Explain rankers in brief
  - How to run locally