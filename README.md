@page
@model IndexModel
@{
    ViewData["Title"] = "Home page";
}

<style>
    @@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

    :root {
        --azure: #0078D4;
        --azure-light: #50B0FF;
        --azure-dark: #005A9E;
        --dot-net: #512BD4;
        --bg: #0A0E1A;
        --surface: #111827;
        --surface-2: #1A2235;
        --border: rgba(255,255,255,0.07);
        --text: #F0F4FF;
        --muted: #7A8BA8;
        --accent: #00D4AA;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
        background: var(--bg);
        color: var(--text);
        font-family: 'DM Sans', sans-serif;
        overflow-x: hidden;
        min-height: 100vh;
    }

    /* ── Grid Background ── */
    .grid-bg {
        position: fixed;
        inset: 0;
        background-image:
            linear-gradient(rgba(0,120,212,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,120,212,0.06) 1px, transparent 1px);
        background-size: 48px 48px;
        pointer-events: none;
        z-index: 0;
    }

    .glow-orb {
        position: fixed;
        width: 600px;
        height: 600px;
        border-radius: 50%;
        filter: blur(120px);
        pointer-events: none;
        z-index: 0;
    }
    .orb-1 { background: rgba(0,120,212,0.15); top: -200px; right: -100px; }
    .orb-2 { background: rgba(81,43,212,0.1); bottom: -200px; left: -100px; }
    .orb-3 { background: rgba(0,212,170,0.07); top: 50%; left: 40%; }

    /* ── Page Wrapper ── */
    .page-wrapper {
        position: relative;
        z-index: 1;
        max-width: 1000px;
        margin: 0 auto;
        padding: 48px 24px 80px;
    }

    /* ── Hero ── */
    .hero {
        text-align: center;
        padding: 60px 0 56px;
        animation: fadeUp 0.7s ease both;
    }

    .badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: rgba(0,120,212,0.12);
        border: 1px solid rgba(0,120,212,0.3);
        border-radius: 100px;
        padding: 6px 16px;
        font-size: 12px;
        font-weight: 500;
        color: var(--azure-light);
        letter-spacing: 0.08em;
        text-transform: uppercase;
        margin-bottom: 28px;
    }
    .badge-dot {
        width: 6px; height: 6px;
        border-radius: 50%;
        background: var(--azure-light);
        animation: pulse 2s infinite;
    }

    .hero h1 {
        font-family: 'Syne', sans-serif;
        font-size: clamp(2rem, 5vw, 3.2rem);
        font-weight: 800;
        line-height: 1.15;
        letter-spacing: -0.02em;
        margin-bottom: 20px;
        background: linear-gradient(135deg, #fff 0%, var(--azure-light) 60%, var(--accent) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    .hero p {
        font-size: 1.05rem;
        color: var(--muted);
        max-width: 560px;
        margin: 0 auto 32px;
        line-height: 1.7;
        font-weight: 300;
    }

    .hero-actions {
        display: flex;
        gap: 12px;
        justify-content: center;
        flex-wrap: wrap;
    }

    .btn-primary {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: var(--azure);
        color: #fff;
        padding: 12px 24px;
        border-radius: 8px;
        text-decoration: none;
        font-weight: 500;
        font-size: 0.9rem;
        transition: background 0.2s, transform 0.15s;
    }
    .btn-primary:hover { background: var(--azure-dark); transform: translateY(-1px); }

    .btn-ghost {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: transparent;
        border: 1px solid var(--border);
        color: var(--muted);
        padding: 12px 24px;
        border-radius: 8px;
        text-decoration: none;
        font-weight: 400;
        font-size: 0.9rem;
        transition: border-color 0.2s, color 0.2s, transform 0.15s;
    }
    .btn-ghost:hover { border-color: rgba(255,255,255,0.2); color: var(--text); transform: translateY(-1px); }

    /* ── Divider ── */
    .divider {
        height: 1px;
        background: var(--border);
        margin: 0 0 48px;
    }

    /* ── Section title ── */
    .section-label {
        font-family: 'Syne', sans-serif;
        font-size: 0.75rem;
        font-weight: 600;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--azure-light);
        margin-bottom: 24px;
    }

    /* ── Steps ── */
    .steps-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 16px;
        margin-bottom: 48px;
    }

    .step-card {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 24px;
        position: relative;
        overflow: hidden;
        transition: border-color 0.2s, transform 0.2s;
        animation: fadeUp 0.6s ease both;
    }
    .step-card:hover {
        border-color: rgba(0,120,212,0.35);
        transform: translateY(-2px);
    }
    .step-card::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(135deg, rgba(0,120,212,0.04) 0%, transparent 60%);
        pointer-events: none;
    }

    .step-number {
        font-family: 'Syne', sans-serif;
        font-size: 0.7rem;
        font-weight: 700;
        letter-spacing: 0.1em;
        color: var(--azure);
        text-transform: uppercase;
        margin-bottom: 10px;
    }

    .step-title {
        font-family: 'Syne', sans-serif;
        font-size: 0.95rem;
        font-weight: 700;
        color: var(--text);
        margin-bottom: 8px;
    }

    .step-desc {
        font-size: 0.85rem;
        color: var(--muted);
        line-height: 1.6;
        font-weight: 300;
    }

    .step-icon {
        position: absolute;
        top: 20px;
        right: 20px;
        width: 32px;
        height: 32px;
        background: rgba(0,120,212,0.1);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 15px;
    }

    /* ── Tech Chips ── */
    .tech-row {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        margin-bottom: 48px;
    }

    .chip {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        background: var(--surface-2);
        border: 1px solid var(--border);
        border-radius: 100px;
        padding: 7px 14px;
        font-size: 0.82rem;
        color: var(--muted);
        font-weight: 400;
    }
    .chip-dot {
        width: 6px; height: 6px; border-radius: 50%;
    }

    /* ── Footer card ── */
    .footer-card {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 16px;
        padding: 32px 36px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 24px;
        flex-wrap: wrap;
        animation: fadeUp 0.8s ease both;
    }

    .author-block {}
    .author-label {
        font-size: 0.75rem;
        color: var(--muted);
        letter-spacing: 0.08em;
        text-transform: uppercase;
        margin-bottom: 4px;
    }
    .author-name {
        font-family: 'Syne', sans-serif;
        font-size: 1.4rem;
        font-weight: 800;
        background: linear-gradient(90deg, var(--text), var(--azure-light));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    .footer-thanks {
        font-size: 0.88rem;
        color: var(--muted);
        max-width: 360px;
        line-height: 1.6;
        font-weight: 300;
    }

    /* ── Animations ── */
    @@keyframes fadeUp {
        from { opacity: 0; transform: translateY(18px); }
        to   { opacity: 1; transform: translateY(0); }
    }
    @@keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.4; }
    }

    .step-card:nth-child(1) { animation-delay: 0.05s; }
    .step-card:nth-child(2) { animation-delay: 0.12s; }
    .step-card:nth-child(3) { animation-delay: 0.19s; }
    .step-card:nth-child(4) { animation-delay: 0.26s; }
    .step-card:nth-child(5) { animation-delay: 0.33s; }
</style>

<!-- Background layers -->
<div class="grid-bg"></div>
<div class="glow-orb orb-1"></div>
<div class="glow-orb orb-2"></div>
<div class="glow-orb orb-3"></div>

<div class="page-wrapper">

    <!-- Hero -->
    <section class="hero">
        <div class="badge">
            <span class="badge-dot"></span>
            Azure Hosted · ASP.NET Core
        </div>
        <h1>My Azure Hosted<br />Web Application</h1>
        <p>
            Built with ASP.NET Core and deployed to Microsoft Azure —
            explore how to scaffold, develop, and ship modern web apps to the cloud.
        </p>
        <div class="hero-actions">
            <a href="https://learn.microsoft.com/aspnet/core" target="_blank" class="btn-primary">
                📖 ASP.NET Core Docs
            </a>
            <a href="https://portal.azure.com" target="_blank" class="btn-ghost">
                ☁️ Azure Portal →
            </a>
        </div>
    </section>

    <div class="divider"></div>

    <!-- Steps -->
    <p class="section-label">Deployment Walkthrough</p>

    <div class="steps-grid">
        <div class="step-card">
            <div class="step-icon">🛠️</div>
            <div class="step-number">Step 01</div>
            <div class="step-title">Create the Project</div>
            <p class="step-desc">Scaffold a new ASP.NET Core Web Application using the Visual Studio template or the <code>.NET CLI</code>.</p>
        </div>
        <div class="step-card">
            <div class="step-icon">⚙️</div>
            <div class="step-number">Step 02</div>
            <div class="step-title">Build Your App</div>
            <p class="step-desc">Add controllers, views, Razor Pages, or Blazor components along with any required services and middleware.</p>
        </div>
        <div class="step-card">
            <div class="step-icon">🧪</div>
            <div class="step-number">Step 03</div>
            <div class="step-title">Test Locally</div>
            <p class="step-desc">Run and validate the application locally with <code>dotnet run</code> to confirm it behaves as expected before publishing.</p>
        </div>
        <div class="step-card">
            <div class="step-icon">🚀</div>
            <div class="step-number">Step 04</div>
            <div class="step-title">Publish to Azure</div>
            <p class="step-desc">Deploy using Visual Studio's Publish wizard or the <code>az webapp up</code> command via the Azure CLI.</p>
        </div>
        <div class="step-card">
            <div class="step-icon">📊</div>
            <div class="step-number">Step 05</div>
            <div class="step-title">Monitor &amp; Manage</div>
            <p class="step-desc">Track performance, logs, and scaling in the Azure Portal or using Application Insights for full observability.</p>
        </div>
    </div>

    <!-- Tech chips -->
    <p class="section-label">Built With</p>
    <div class="tech-row">
        <span class="chip"><span class="chip-dot" style="background:#512BD4"></span>.NET 8</span>
        <span class="chip"><span class="chip-dot" style="background:#0078D4"></span>Azure App Service</span>
        <span class="chip"><span class="chip-dot" style="background:#00D4AA"></span>ASP.NET Core MVC</span>
        <span class="chip"><span class="chip-dot" style="background:#F25022"></span>Visual Studio 2022</span>
        <span class="chip"><span class="chip-dot" style="background:#0078D4"></span>Azure CLI</span>
    </div>

    <div class="divider"></div>

    <!-- Footer card -->
    <div class="footer-card">
        <div class="author-block">
            <div class="author-label">Created by</div>
            <div class="author-name">Parth Shukla</div>
        </div>
        <p class="footer-thanks">
            Thanks for your time — I hope this walkthrough helps you get started
            building and deploying your own web app on Azure. Happy coding! 🎉
        </p>
    </div>

</div>
