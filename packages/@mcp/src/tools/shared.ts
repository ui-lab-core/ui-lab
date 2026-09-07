/**
 * Tool definitions are re-sent on every request in a session, so their text is
 * the one cost that is paid per turn rather than per call. The reference
 * grammar, the response format, and the import rule are therefore stated once
 * in the server instructions and never repeated in a description.
 *
 * The shared output schema was removed with it. Declaring `outputSchema`
 * obliges the server to return `structuredContent` as well as the text body,
 * which sent every response twice for any client that reads both.
 */
export const limitProperty = {
  type: "number" as const,
  minimum: 1,
  maximum: 200,
  description: "Ranked matches to return (default 5), or entries in a listing (default 50).",
};
