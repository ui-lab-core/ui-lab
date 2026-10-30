/**
 * Keep tool-specific guidance here and common guidance in initialize.instructions.
 * Clients may repeat that shared prefix on every tool; budgets must count it
 * per tool, not assume central delivery to the model.
 */
export const limitProperty = {
  type: "number" as const,
  minimum: 1,
  maximum: 200,
  description: "Search: default 5, capped at 25. Listings/examples: default 50, capped at 200.",
};
