import 'server-only'

// FILLER (People of City). People of Bengaluru takes an application fee through its payment provider; payments aren't
// part of the open base (no checkout, no webhook). Applications work without them. Plug in your provider here if you
// want a paid application.

export type DodoPayment = {
  payment_id: string
  status: string | null
  total_amount: number
  currency: string
  metadata: Record<string, string>
  customer?: { email?: string }
}

export type DodoRefund = { refund_id: string; payment_id: string; status: 'succeeded' | 'failed' | 'pending' | 'review' }

/** Refund a payment. The filler has no payments to refund. */
export async function refundPayment(paymentId: string, reason: string, metadata: Record<string, string>): Promise<DodoRefund> {
  void reason
  void metadata
  throw new Error(`payments aren't part of the open base (refund of ${paymentId} not sent)`)
}
