<naming>
Names are generic, never prefixed with the component or feature they belong to. Scope comes from where a name is defined (selector, module, file), not from the name itself.
- Correct: `--background`, `--foreground`, `--radius`
- Wrong: `--component-background`, `--feature-radius`
Prefer the shortest generic name that reads clearly in context. Add a qualifier only to disambiguate two things in the same scope, never to restate the owner.
</naming>
