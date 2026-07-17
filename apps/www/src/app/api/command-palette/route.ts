import { componentMetadata } from "ui-lab-registry";

export function GET() {
  return Response.json({
    components: componentMetadata.map(({ id, name, description, tags }) => ({
      id,
      name,
      description,
      tags,
    })),
  });
}
