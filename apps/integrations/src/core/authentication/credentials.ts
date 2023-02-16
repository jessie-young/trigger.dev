import { EndpointSpec } from "core/endpoint/types";
import { InsufficientScopesError } from "core/request/errors";
import { FetchConfig } from "core/request/types";
import { IntegrationAuthentication, AuthCredentials } from "./types";

/** Apply the given credentials to the given fetch config */
export function applyCredentials(
  fetch: FetchConfig,
  {
    endpointSecurity,
    authentication,
    credentials,
  }: {
    endpointSecurity: EndpointSpec["security"];
    authentication: IntegrationAuthentication;
    credentials: AuthCredentials;
  }
): FetchConfig {
  if (endpointSecurity === undefined) return fetch;
  // check if the credentials have the required scopes
  const requiredScopes = endpointSecurity[credentials.name] ?? [];
  const scopesCheckResult = checkRequiredScopes(requiredScopes, credentials);
  if (!scopesCheckResult.success) {
    const error: InsufficientScopesError = {
      type: "insufficient_scopes",
      missingScopes: scopesCheckResult.missingScopes,
    };
    throw error;
  }

  // apply the credentials
  switch (credentials.type) {
    case "oauth2": {
      const authConfig = authentication[credentials.name];
      switch (authConfig.placement.in) {
        case "header": {
          fetch.headers[
            authConfig.placement.key
          ] = `Bearer ${credentials.accessToken}`;
          return fetch;
        }
      }
      break;
    }
    case "api_key": {
      const authConfig = authentication[credentials.name];
      if (authConfig.placement.in === "header") {
        fetch.headers[authConfig.placement.key] = credentials.api_key;
      }
      return fetch;
    }
  }

  throw new Error("Invalid credentials");
}

type ScopesCheckResult =
  | {
      success: true;
    }
  | {
      success: false;
      missingScopes: string[];
    };

/** Check if the given credentials have the required scopes */
export function checkRequiredScopes(
  requiredScopes: string[],
  credentials: AuthCredentials
): ScopesCheckResult {
  const missingScopes = requiredScopes.filter(
    (scope) => !credentials.scopes.includes(scope)
  );

  if (missingScopes.length > 0) {
    return {
      success: false,
      missingScopes,
    };
  }

  return {
    success: true,
  };
}