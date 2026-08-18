// api/_lib/triggerRebuild.ts
//
// Called by save-media.ts and save-project-text.ts right after a
// successful write. Branches on environment because "rebuild" means
// two genuinely different things:
//
// - Locally (`vercel dev`): there's no separate deploy step — the
//   dev server just serves portfolio.generated.json straight off
//   disk. So here, "rebuild" means directly regenerating that file
//   in place, which Vite's dev server then hot-reloads.
//
// - Production/Preview: a serverless function CANNOT rebuild the
//   deployed static site — the JS bundle is immutable until a real
//   new deployment happens. So here, "rebuild" means POSTing to a
//   Vercel Deploy Hook URL, which enqueues a fresh deployment (full
//   pipeline rerun, then goes live ~1-2 minutes later). This POST
//   itself returns fast — it does NOT wait for the deployment to
//   finish, so it's safe to await before responding to the client.
//
// process.env.VERCEL_ENV is set by Vercel itself: "development" under
// `vercel dev`, "preview" or "production" when actually deployed.

export async function triggerRebuild(): Promise<{ mode: "local" | "deploy-hook" | "skipped"; detail?: string }> {
	const isLocal = process.env.VERCEL_ENV === "development" || !process.env.VERCEL_ENV;
  
	if (isLocal) {
	  try {
		// Dynamic import so this dependency (and its Neon connection)
		// only loads when actually needed, not on every cold start.
		const { generatePortfolioJson } = await import("../../scripts/buildPortfolio.js");
		const count = await generatePortfolioJson();
		return { mode: "local", detail: `Regenerated locally — ${count} published project(s)` };
	  } catch (err) {
		console.error("Local rebuild failed:", err);
		return { mode: "local", detail: "Local rebuild failed — check server logs" };
	  }
	}
  
	const hookUrl = process.env.VERCEL_DEPLOY_HOOK_URL;
	if (!hookUrl) {
	  console.warn("VERCEL_DEPLOY_HOOK_URL not set — skipping auto-redeploy trigger");
	  return { mode: "skipped", detail: "No deploy hook configured" };
	}
  
	try {
	  await fetch(hookUrl, { method: "POST" });
	  return { mode: "deploy-hook", detail: "Deploy triggered — live in ~1-2 minutes" };
	} catch (err) {
	  console.error("Deploy hook call failed:", err);
	  return { mode: "skipped", detail: "Deploy hook call failed — check server logs" };
	}
  }