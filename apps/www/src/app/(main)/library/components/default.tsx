/**
 * This segment's layout renders only its `sidebar` and `content` slots, so the
 * implicit `children` slot never resolves to a page. Without a default Next
 * falls back to its own parallel-route default, which throws notFound() and
 * leaves the RSC chunk permanently rejected even though nothing is rendered.
 */
export default function ChildrenDefault() {
  return null;
}
