# Deployment & Operations Guide

**Phase 8: Public Launch & Docs**

## Table of Contents

1. [Pre-Launch Checklist](#pre-launch-checklist)
2. [Infrastructure Setup](#infrastructure-setup)
3. [Deployment Steps](#deployment-steps)
4. [Monitoring & Observability](#monitoring--observability)
5. [Incident Response](#incident-response)
6. [Post-Launch](#post-launch)

---

## Pre-Launch Checklist

### Security
- [ ] All secrets stored in environment variables (no hardcoded keys)
- [ ] Rate limiting configured (1,000 req/min public, 10,000 req/min auth)
- [ ] CORS headers properly configured
- [ ] Authentication tokens validated
- [ ] DDoS protection enabled (Cloudflare)

### Performance
- [ ] CDN cache TTL configured (24h for latest, 1y for versioned)
- [ ] ETag generation working
- [ ] Manifest cached (1 hour TTL)
- [ ] Load testing passed (>10,000 req/sec)
- [ ] Database queries optimized

### Testing
- [ ] Unit tests passing (90%+ coverage)
- [ ] Integration tests for all endpoints
- [ ] E2E tests for SDK integrations
- [ ] Security audit completed
- [ ] Performance benchmarks baseline recorded

### Documentation
- [ ] API docs published (API.md)
- [ ] SDK documentation complete
- [ ] Quickstart guide written
- [ ] Migration guide from hardcoded URLs
- [ ] FAQ updated

### Analytics
- [ ] Request logging enabled
- [ ] Download tracking configured
- [ ] Error tracking integrated (Sentry)
- [ ] Webhooks tested end-to-end

---

## Infrastructure Setup

### Cloudflare Workers

```bash
# Install wrangler
npm install -g wrangler

# Login
wrangler login

# Create project
wrangler generate branding-api

# Configure (see wrangler.toml)
# - Database: D1
# - KV Cache: branding-cache
# - R2 Bucket: branding-assets
```

### Environment Variables

Create `.env.production`:
```env
ENVIRONMENT=production
DATABASE_URL=database-url-here
GITHUB_TOKEN=ghp_xxxxx
SLACK_WEBHOOK_URL=https://hooks.slack.com/...
RATE_LIMIT_ENABLED=true
RATE_LIMIT_REQUESTS_PER_MINUTE=1000
```

### DNS Configuration

```
branding.sleepystudio.xyz → branding-api.workers.dev (CNAME)
cdn.sleepystudio.xyz → branding-assets.r2.amazonaws.com (CNAME)
api.sleepystudio.xyz → branding-api.workers.dev (CNAME)
```

### CDN Setup (Cloudflare R2)

```bash
# Create bucket
wrangler r2 bucket create branding-assets

# Configure cache headers
# Public: max-age=86400 (24h)
# Versioned: max-age=31536000 (1y, immutable)

# Enable public access
# Create bucket policy allowing public read
```

### Database Setup (D1)

```bash
# Create database
wrangler d1 create branding

# Run migrations
wrangler d1 execute branding --file schema.sql

# Verify
wrangler d1 query branding "SELECT COUNT(*) FROM assets"
```

---

## Deployment Steps

### Step 1: Build

```bash
cd branding

# Install dependencies
npm install

# Build TypeScript
npm run build

# Run tests
npm test

# Lint
npm run lint
```

### Step 2: Stage to Preview

```bash
# Deploy to preview environment
wrangler publish --env preview

# Run smoke tests
curl https://branding-preview.workers.dev/api/v1/assets

# Test webhooks
npm run test:webhooks:preview

# Test SDK
npm run test:sdk:preview
```

### Step 3: Production Deployment

```bash
# Deploy to production
wrangler publish --env production

# Run smoke tests
curl https://branding.sleepystudio.xyz/api/v1/assets

# Verify CDN
curl -I https://cdn.sleepystudio.xyz/logos/svg/LogoBlack.svg

# Monitor rollout
wrangler tail --env production
```

### Step 4: Post-Deployment

```bash
# Verify DNS
nslookup branding.sleepystudio.xyz

# Test from multiple regions
for region in us-east eu-west ap-south; do
  curl -w "Region: $region, Time: %{time_total}s\n" \
    https://branding.sleepystudio.xyz/api/v1/assets
done

# Monitor error rates
# Check Sentry dashboard
```

---

## Monitoring & Observability

### Key Metrics

**API Metrics**:
- Request count by endpoint
- P50/P95/P99 latency
- Error rate (4xx, 5xx)
- Cache hit rate

**Asset Metrics**:
- Downloads by asset ID
- Downloads by format
- Popular assets (top 10)
- Download trends

**System Metrics**:
- Worker CPU time
- Database queries
- KV read/write operations
- R2 bandwidth

### Logging

```typescript
// Example: Log asset request
console.log({
  timestamp: new Date().toISOString(),
  method: 'GET',
  path: '/api/v1/assets/logo-black',
  status: 200,
  duration_ms: 42,
  cache_hit: true,
  user_agent: request.headers.get('user-agent')
})
```

### Alerting

**High Priority**:
- Error rate > 1%
- API latency P99 > 1000ms
- Database connection failures
- Rate limit rejections > 5%

**Medium Priority**:
- Cache hit rate < 80%
- Disk space > 80% (R2)
- Slow queries > 500ms

**Low Priority**:
- Webhook delivery failures
- Missing assets in manifest

---

## Incident Response

### Level 1: Degradation

**Symptoms**: Slow responses, high latency

**Response**:
1. Check cache hit rate
2. Check database slow queries
3. Review recent deployments
4. Scale up worker instances if needed

### Level 2: Partial Outage

**Symptoms**: 10-50% requests failing

**Response**:
1. Page on-call engineer
2. Check error logs in Sentry
3. Review traffic patterns
4. Consider rollback

### Level 3: Full Outage

**Symptoms**: >50% requests failing

**Response**:
1. Page entire team
2. Initiate war room call
3. Check deployment status
4. Immediate rollback if needed
5. Post-mortem within 24 hours

### Rollback

```bash
# View deployment history
wrangler deployments list

# Rollback to previous
wrangler rollback --version <version-id>

# Verify
curl https://branding.sleepystudio.xyz/api/v1/assets
```

---

## Post-Launch

### Week 1: Monitoring

- [ ] Monitor error rates (target: < 0.1%)
- [ ] Monitor latency (target: P95 < 200ms)
- [ ] Review first 1,000 API requests
- [ ] Check webhook delivery success rate
- [ ] Respond to early feedback

### Week 2: Optimization

- [ ] Analyze slow queries, optimize
- [ ] Adjust cache TTLs based on usage
- [ ] Fine-tune rate limits
- [ ] Update documentation based on real usage
- [ ] Create FAQ from support tickets

### Week 4: Expansion

- [ ] Enable authentication for higher rate limits
- [ ] Launch Python SDK
- [ ] Launch Go SDK
- [ ] Publish blog announcement
- [ ] Send team notification

### Month 2: Hardening

- [ ] Security audit with third party
- [ ] Performance benchmarks vs competitors
- [ ] WCAG 2.1 AA accessibility audit
- [ ] Disaster recovery drill
- [ ] Update incident response playbook

---

## Useful Commands

```bash
# View logs
wrangler tail --env production

# Test endpoint
curl -H "Accept: application/json" \
  https://branding.sleepystudio.xyz/api/v1/assets

# Test with format negotiation
curl -H "Accept: image/svg+xml" \
  https://branding.sleepystudio.xyz/api/v1/assets/logo-black

# Monitor rate limiting
for i in {1..1100}; do
  curl -s https://branding.sleepystudio.xyz/api/v1/assets | head -c 1
done

# Check database
wrangler d1 query branding "SELECT COUNT(*) as total FROM assets"

# Trigger webhook manually
curl -X POST https://your-webhook-endpoint.com \
  -H "Content-Type: application/json" \
  -d '{"event": "asset_updated", "asset_id": "logo-black"}'
```

---

## Support Contacts

- **On-Call**: [PagerDuty schedule]
- **Team Lead**: [Name/Email]
- **DevOps**: [Name/Email]
- **Product**: [Name/Email]

## Documentation Links

- [API Documentation](./API.md)
- [GitHub Repository](https://github.com/Sleepy-Studio/branding)
- [Status Page](https://status.sleepystudio.xyz)
- [Runbook](./RUNBOOK.md)
