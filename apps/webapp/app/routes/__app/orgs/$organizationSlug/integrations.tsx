import type { LoaderArgs } from "@remix-run/server-runtime";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import invariant from "tiny-invariant";
import { LargeTitle } from "~/components/primitives/text/LargeTitle";
import { Title } from "~/components/primitives/text/Title";
import { useCurrentOrganization } from "~/hooks/useOrganizations";
import { getApiConnectionsForOrganizationSlug } from "~/models/apiConnection.server";
import { ConnectButton, integrations } from "~/routes/resources/connection";
import { requireUserId } from "~/services/session.server";

export const loader = async ({ request, params }: LoaderArgs) => {
  await requireUserId(request);
  const { organizationSlug } = params;
  invariant(organizationSlug, "organizationSlug not found");

  const connections = await getApiConnectionsForOrganizationSlug({
    slug: organizationSlug,
  });

  return typedjson({ connections });
};

export default function Integrations() {
  const { connections } = useTypedLoaderData<typeof loader>();
  const organization = useCurrentOrganization();
  invariant(organization, "Organization not found");

  return (
    <div>
      <LargeTitle>Integrations</LargeTitle>
      <div>
        <Title>Existing integrations</Title>
        {connections.map((connection) => (
          <div key={connection.id}>{connection.title}</div>
        ))}
      </div>

      <div>
        <Title>Add integration</Title>
        {integrations.map((integration) => (
          <ConnectButton
            key={integration.key}
            integration={integration}
            organizationId={organization.id}
          />
        ))}
      </div>
    </div>
  );
}