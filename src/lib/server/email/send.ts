import 'server-only'

// FILLER (People of City). People of Bengaluru sends its emails (application received, approved, connect requests,
// matches, chat digests) through its own email templates, which aren't part of the open base. Plug in your email
// provider here: every caller only needs to know whether a message was sent or skipped.

export type SendResult = { ok?: boolean; skipped?: boolean }

/** Send a transactional email. The filler sends nothing and says so. */
export async function sendTemplate(to: string, template: string, variables: Record<string, string>): Promise<SendResult> {
  void to
  void template
  void variables
  return { skipped: true }
}
