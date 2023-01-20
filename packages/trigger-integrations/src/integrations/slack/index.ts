import { getTriggerRun } from "@trigger.dev/sdk";
import { z } from "zod";
import { slack } from "@trigger.dev/providers";

export type PostMessageOptions = z.infer<
  typeof slack.schemas.PostMessageOptionsSchema
>;

export type PostMessageResponse = z.infer<
  typeof slack.schemas.PostMessageSuccessResponseSchema
>;

export async function postMessage(
  key: string,
  options: PostMessageOptions
): Promise<PostMessageResponse> {
  const run = getTriggerRun();

  if (!run) {
    throw new Error("Cannot call postMessage outside of a trigger run");
  }

  const output = await run.performRequest(key, {
    service: "slack",
    endpoint: "chat.postMessage",
    params: options,
    response: {
      schema: slack.schemas.PostMessageSuccessResponseSchema,
    },
  });

  return output;
}

export type InviteUserToChannelOptions = z.infer<
  typeof slack.schemas.InviteUserToChannelOptionsSchema
>;

export type InviteUserToChannelResponse = z.infer<
  typeof slack.schemas.InviteUserToChannelSuccessResponseSchema
>;

export async function inviteUsersToChannel(
  key: string,
  options: InviteUserToChannelOptions
): Promise<InviteUserToChannelResponse> {
  const run = getTriggerRun();

  if (!run) {
    throw new Error(
      "Cannot call inviteUsersToChannel outside of a trigger run"
    );
  }

  const output = await run.performRequest(key, {
    service: "slack",
    endpoint: "conversations.invite",
    params: options,
    response: {
      schema: slack.schemas.InviteUserToChannelSuccessResponseSchema,
    },
  });

  return output;
}
