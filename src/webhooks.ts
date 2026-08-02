/**
 * Phase 5: Webhooks & Automation System
 * Notifies dependent repos when assets are updated
 */

interface WebhookPayload {
  event: 'asset_updated' | 'asset_deleted' | 'asset_created'
  asset_id: string
  asset_name: string
  timestamp: string
  changes: Record<string, any>
  manifestVersion: string
}

interface WebhookSubscription {
  id: string
  url: string
  events: string[]
  active: boolean
  lastDelivery?: string
}

// Webhook registry (in production, use database)
const webhookSubscriptions = new Map<string, WebhookSubscription>()

export async function registerWebhook(
  url: string,
  events: string[]
): Promise<{ id: string; secret: string }> {
  const id = crypto.randomUUID()
  const secret = crypto.randomUUID()

  webhookSubscriptions.set(id, {
    id,
    url,
    events,
    active: true
  })

  return { id, secret }
}

export async function triggerWebhook(payload: WebhookPayload) {
  const subscriptions = Array.from(webhookSubscriptions.values())
    .filter(sub =>
      sub.active && sub.events.includes(payload.event)
    )

  for (const subscription of subscriptions) {
    await deliverWebhook(subscription, payload)
  }
}

async function deliverWebhook(
  subscription: WebhookSubscription,
  payload: WebhookPayload,
  attempt: number = 1
): Promise<void> {
  const MAX_ATTEMPTS = 3
  const RETRY_DELAY = 5000

  try {
    const response = await fetch(subscription.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Branding-Signature': generateSignature(payload),
        'X-Branding-Delivery': crypto.randomUUID()
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(30000)
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    // Log successful delivery
    console.log(`Webhook delivered to ${subscription.url}`)
  } catch (error) {
    console.error(`Webhook delivery failed (attempt ${attempt}):`, error)

    if (attempt < MAX_ATTEMPTS) {
      // Exponential backoff retry
      await new Promise(resolve =>
        setTimeout(resolve, RETRY_DELAY * Math.pow(2, attempt - 1))
      )
      await deliverWebhook(subscription, payload, attempt + 1)
    } else {
      console.error(`Webhook delivery failed after ${MAX_ATTEMPTS} attempts`)
      // Dead letter queue for failed webhooks
      await storeDLQItem({
        subscriptionId: subscription.id,
        payload,
        error: 'Max retries exceeded',
        timestamp: new Date().toISOString()
      })
    }
  }
}

function generateSignature(payload: WebhookPayload): string {
  const data = JSON.stringify(payload)
  // In production, use HMAC-SHA256 with secret
  return 'sha256=' + btoa(data).substring(0, 64)
}

async function storeDLQItem(item: any): Promise<void> {
  // Store in persistent queue for retry/investigation
  console.log('DLQ Item:', item)
}

// GitHub Actions integration
export async function triggerGitHubAction(
  repo: string,
  workflow: string,
  inputs: Record<string, string>
): Promise<void> {
  const token = process.env.GITHUB_TOKEN

  const response = await fetch(
    `https://api.github.com/repos/${repo}/actions/workflows/${workflow}/dispatches`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ref: 'main',
        inputs
      })
    }
  )

  if (!response.ok) {
    throw new Error(`Failed to trigger workflow: ${response.statusText}`)
  }
}

// Asset update listener
export async function handleAssetUpdate(assetId: string, changes: any) {
  const payload: WebhookPayload = {
    event: 'asset_updated',
    asset_id: assetId,
    asset_name: changes.name || assetId,
    timestamp: new Date().toISOString(),
    changes,
    manifestVersion: '1.0.0'
  }

  // Trigger webhooks
  await triggerWebhook(payload)

  // Trigger dependent repo workflows
  await triggerGitHubAction(
    'Sleepy-Studio/landing',
    'sync-branding-assets.yml',
    {
      asset_id: assetId,
      event: payload.event
    }
  )

  // Notify team
  await notifyTeam(payload)
}

async function notifyTeam(payload: WebhookPayload): Promise<void> {
  const slackWebhook = process.env.SLACK_WEBHOOK_URL

  if (!slackWebhook) return

  await fetch(slackWebhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: `🎨 Asset Updated: ${payload.asset_name}`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*${payload.event.replace('_', ' ').toUpperCase()}*\n\`${payload.asset_id}\`\n${new Date(payload.timestamp).toLocaleString()}`
          }
        }
      ]
    })
  })
}

// CLI command example
export async function cliUpdateAsset(
  assetId: string,
  file: string,
  metadata?: Record<string, any>
): Promise<void> {
  console.log(`Updating asset: ${assetId}`)

  // 1. Validate file
  // 2. Upload to storage
  // 3. Update manifest
  // 4. Trigger webhooks
  // 5. Notify team

  await handleAssetUpdate(assetId, {
    ...metadata,
    file,
    updatedAt: new Date().toISOString()
  })

  console.log(`✓ Asset ${assetId} updated and webhooks triggered`)
}
