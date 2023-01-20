import { z } from "zod";

export const PostMessageSuccessResponseSchema = z.object({
  ok: z.literal(true),
  channel: z.string(),
  ts: z.string(),
  message: z.object({
    text: z.string(),
    user: z.string(),
    bot_id: z.string(),
    attachments: z.array(z.unknown()).optional(),
    type: z.string(),
    subtype: z.string().optional(),
    ts: z.string(),
  }),
});

export const ErrorResponseSchema = z.object({
  ok: z.literal(false),
  error: z.string(),
});

export const PostMessageResponseSchema = z.discriminatedUnion("ok", [
  PostMessageSuccessResponseSchema,
  ErrorResponseSchema,
]);

export const PostMessageBodySchema = z.object({
  channel: z.string(),
  text: z.string(),
});

export const ChannelNameOrIdSchema = z.union([
  z.object({ channelId: z.string() }),
  z.object({ channelName: z.string() }),
]);

export const PostMessageOptionsSchema = z
  .object({
    text: z.string(),
  })
  .and(ChannelNameOrIdSchema);

export const JoinConversationSuccessResponseSchema = z.object({
  ok: z.literal(true),
  channel: z.object({
    id: z.string(),
  }),
});

export const JoinConversationResponseSchema = z.discriminatedUnion("ok", [
  JoinConversationSuccessResponseSchema,
  ErrorResponseSchema,
]);

export const JoinConversationBodySchema = z.object({
  channel: z.string(),
});

export const ListConversationsSuccessResponseSchema = z.object({
  ok: z.literal(true),
  channels: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    })
  ),
});

export const ListConversationsResponseSchema = z.discriminatedUnion("ok", [
  ListConversationsSuccessResponseSchema,
  ErrorResponseSchema,
]);

export const InviteUserToChannelBodySchema = z.object({
  users: z.string(),
  channel: z.string(),
});

export const InviteUserToChannelOptionsSchema = z
  .object({
    userIds: z.array(z.string()),
  })
  .and(ChannelNameOrIdSchema);

export const InviteUserToChannelSuccessResponseSchema = z.object({
  ok: z.literal(true),
  channel: z.object({
    id: z.string(),
    name: z.string(),
    is_channel: z.boolean(),
    is_group: z.boolean(),
    is_im: z.boolean(),
    created: z.number(),
    creator: z.string(),
    is_archived: z.boolean(),
    is_general: z.boolean(),
    unlinked: z.number(),
    name_normalized: z.string(),
    is_read_only: z.boolean(),
    is_shared: z.boolean(),
    is_ext_shared: z.boolean(),
    is_org_shared: z.boolean(),
    pending_shared: z.array(z.unknown()),
    is_pending_ext_shared: z.boolean(),
    is_member: z.boolean(),
    is_private: z.boolean(),
    is_mpim: z.boolean(),
    last_read: z.string(),
    topic: z.object({
      value: z.string(),
      creator: z.string(),
      last_set: z.number(),
    }),
    purpose: z.object({
      value: z.string(),
      creator: z.string(),
      last_set: z.number(),
    }),
    previous_names: z.array(z.string()),
  }),
});

export const InviteUserToChannelErrorResponseSchema =
  ErrorResponseSchema.extend({
    errors: z.array(
      z.object({
        user: z.string(),
        ok: z.boolean(),
        error: z.string(),
      })
    ),
  });

export const InviteUserToChannelResponseSchema = z.discriminatedUnion("ok", [
  InviteUserToChannelSuccessResponseSchema,
  InviteUserToChannelErrorResponseSchema,
]);
