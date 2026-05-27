---
name: security-triage
description: "Use when ANY file matching security-sensitive patterns is created, modified, or reviewed. Hard-coded triage rules that bypass LLM judgment. MANDATORY triggers: auth, credentials, tokens, encryption, injection, permissions, secrets."
---

# Security Triage — Hard-Coded Trigger Rules

## The Problem

LLMs are blind to security context when task descriptions don't explicitly mention it.
A task named "Refactor user data endpoint" looks benign. The same work touches authentication
boundaries, credential validation, and permission checks. Without hard-coded triggers,
the agent processes it via a low-tier route and **skips the security audit entirely**.

**This is not a judgment call. These rules are hard-coded.**

---

## Hard-Coded Triggers

### T1: File Path Matches

Any task that **creates, modifies, or deletes** a file matching these patterns MUST trigger
full security triage — regardless of the task description, user intent, or perceived severity:

```
# Authentication & Identity
*auth*/**          *login*/**          *logout*/**
*session*/**       *identity*/**       *sso*/**

# Credentials & Secrets
*secret*/**        *credential*/**     *token*/**
*cert*/**          *key*/**            *.pem
*.key              *.cert              *.p12

# Security Configuration
*.htaccess         .htpasswd           *security*/**
*.acl              *capability*/**     *rbac*/**

# Encryption & Cryptography
*crypto*/**        *cipher*/**         *encrypt*/**
*hash*/**          *digest*/**         *signature*/**

# Network Security
*tls*/**           *ssl*/**            *cors*/**
*csp*/**           *csrf*/**           *xss*/**

# Data Protection
*sanitize*/**      *escape*/**         *validation*/**
*rate-limit*/**    *throttle*/**       *quota*/**

# Production Safety
*deploy*/**        *rollback*/**       *migration*/**  (with env/prod in path)
*audit*/**         *compliance*/**     *gdpr*/**       *pii*/**

# OAuth & Federation
*oauth*/**         *oidc*/**           *saml*/**
*jwt*/**           *openid*/**

# Infrastructure Security
*firewall*/**      *proxy*/**          *vpn*/**
*secrets-manager*/**  *vault*/**       *hsm*/**
```

### T2: Code Content Matches

Even if the file path does NOT match T1, any file being modified that **contains** these
patterns MUST trigger full security triage:

```
# Function/class definitions touching security
def authenticate*    class Auth*         def authorize*
def validate_token*  def check_permission  def verify_identity*
def encrypt*         def decrypt*        def hash_*
def sign*            def verify_sig*     def sanitize_input*
def escape_html*     def escape_sql*     def rate_limit*

# Imports that introduce security surface
import *crypto*      import *auth*       import *secret*
import *security*    import *oauth*      import *jwt*
import *saml*        import *ssl*        import *tls*

# Configuration keys that control security
SECRET_KEY          API_KEY_*           *PASSWORD*
*TOKEN*              DATABASE_URL        REDIS_URL
AUTH_*              SECURITY_*          ENCRYPTION_*
CORS_*              CSP_*               CSRF_*
SESSION_*           COOKIE_*            JWT_*

# Direct security-sensitive operations
eval(               exec(               subprocess.*
raw_input           os.system           pickle.load
requests.get        urllib.request       sqlite3.execute
```

### T3: Security-Adjacent Paths

Any file in these directories triggers security triage regardless of the file name
or task description:

```
auth/
security/
crypto/
certs/
secrets/
credentials/
permissions/
policies/
audit/
compliance/
middleware/auth*/
middleware/security*/
config/deploy*/
config/secrets*/
```

### T4: Escalation Paths

When any T1-T3 trigger fires:

1. **STOP** — do not proceed with the task as described
2. **Flag** — annotate the task: `[SECURITY-TRIAGE: <trigger-type> <matched-pattern>]`
3. **Audit** — run the full security review checklist (see below)
4. **Escalate** — if the task involves production credentials, secrets, or auth bypass:
   present the findings to the user with a security impact summary BEFORE proceeding
5. **Document** — log the trigger event in the session record

---

## Security Review Checklist

When security triage is triggered, the following checks are MANDATORY:

### Code Review

- [ ] Output encoding/escaping applied at all trust boundaries
- [ ] Session management follows secure patterns (rotation, expiry, httpOnly)
- [ ] CSRF protection on state-changing operations
- [ ] Authentication/Authorization — verify auth checks at every protected boundary, test for privilege escalation
- [ ] Secrets exposure — no secrets in code, comments, git history, or logs; must be externalized to env vars or vault
- [ ] Injection defense — SQL/command/NoSQL injection at every untrusted input boundary; parameterized queries required
- [ ] Rate limiting/throttling on sensitive endpoints (brute force protection)

### Dependency Review

- [ ] No known-vulnerable dependencies introduced
- [ ] Dependency versions are pinned (not floating ranges)
- [ ] New dependencies vetted for supply-chain risk (source, maintenance, license)

### Configuration Review

- [ ] CORS configured with explicit origins (not wildcard)
- [ ] TLS/SSL configuration meets current standards
- [ ] Security headers set (CSP, HSTS, X-Frame-Options, etc.)
- [ ] Debug/development mode disabled in production paths
- [ ] Error messages do not leak internal state

### Testing Review

- [ ] Rate limiting behavior is verified
- [ ] Secrets rotation/replacement is tested
- [ ] Adversarial test cases — negative tests cover auth bypass, injection attempts, privilege escalation, boundary overflow

---

## Trigger Flow

```
Task received
  ↓
Check file paths against T1 (hard-coded pattern match)
  ├─ Match → [SECURITY-TRIAGE: T1 match] → Full security audit
  └─ No match
       ↓
  Check file contents against T2 (existing code patterns)
  ├─ Match → [SECURITY-TRIAGE: T2 match] → Full security audit
  └─ No match
       ↓
  Check directory against T3 (security-adjacent paths)
  ├─ Match → [SECURITY-TRIAGE: T3 match] → Full security audit
  └─ No match
       ↓
  Check task description for security keywords
  ├─ Match → [SECURITY-TRIAGE: keyword match] → Full security audit
  └─ No match
       ↓
  Continue with normal workflow
```

---

## Red Flags

| Pattern | Why It's Wrong |
|---------|----------------|
| "This file doesn't look security-related" | **Pattern matching overrides judgment.** Always match against T1-T3. |
| "The task name is just 'refactor data'" | **Triggers fire on paths and content, not task names.** |
| "I've seen this file before, it's fine" | **Every modification is a new security boundary.** Re-check. |
| "Skipping triage saves time" | **A missed security review costs orders of magnitude more than the review itself.** |
| "I'll note it but not escalate" | **Escalation is hard-coded.** If it matches T4 criteria, you escalate. |
