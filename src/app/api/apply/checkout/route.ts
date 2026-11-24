import { openApplicationOf } from '@/lib/server/applications'
import { admin, json, userFrom } from '@/lib/server/supabaseAdmin'

// FILLER (People of City). Applications are free in the open base (src/lib/apply.ts APPLICATIONS_FREE): the saved
// application goes straight to a reviewer. Paid checkout is optional; plug in your payment
// provider here if you want an application fee.

export async function POST(req: Request) {
  const user = await userFrom(req)
  if (!user?.email) return json({ error: 'signed_out' }, 401)

  const app = await openApplicationOf(user.id)
  if (!app) return json({ error: 'no_application' }, 404)
  if (app.status !== 'draft' && app.status !== 'submitted') return json({ error: 'already_paid', status: app.status }, 409)

  const { error } = await admin()
    .from('applications')
    .update({ status: 'under_review' })
    .eq('id', app.id)
    .in('status', ['draft', 'submitted'])
  if (error) return json({ error: 'save_failed' }, 500)
  return json({ status: 'under_review' })
}
