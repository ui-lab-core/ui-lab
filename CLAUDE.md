<naming>
Names are generic, never prefixed with the component or feature they belong to. Scope comes from where a name is defined (selector, module, file), not from the name itself.
- Correct: `--background`, `--foreground`, `--radius`
- Wrong: `--component-background`, `--feature-radius`
Prefer the shortest generic name that reads clearly in context. Add a qualifier only to disambiguate two things in the same scope, never to restate the owner.
</naming>

<debugging>
Diagnose from source, not from runtime. When fixing a bug, read the actual code path end to end and reason to a root cause before reaching for any runtime tooling. Do not launch browsers, Playwright, dev servers, debuggers, or ad-hoc scripts to observe the bug or verify a fix unless static analysis has genuinely dead-ended and you say so explicitly first. One hypothesis confirmed in code beats ten rounds of runtime probing. After the fix, stop — the user verifies.
</debugging>

<testing>
This project follows an implementation-first testing approach. For every bug fix or feature:
1. Write the implementation code
2. Write tests that validate the expected behavior and outcomes
3. Run tests to confirm they pass
4. Run all tests to confirm nothing is broken
Test coverage should validate high-level, user-facing behavior — not implementation details.
</testing>
