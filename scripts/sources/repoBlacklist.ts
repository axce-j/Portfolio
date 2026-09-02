// scripts/sources/repoBlacklist.ts
//
// Repos that should NEVER become projects, even though they're public
// and not forks. Paste the full GitHub URL — syncGithub.ts normalizes it.
// This is NOT a security boundary — it only controls what appears on the
// portfolio site. To actually hide a repo's contents, make it private on
// GitHub itself.

export const REPO_BLACKLIST: string[] = [
	// "https://github.com/yourname/old-course-exercise",
	// "https://github.com/yourname/dotfiles",
	"https://github.com/axce-j/NestProject"
  ];
  
  // Normalizes "https://github.com/owner/repo" (with or without trailing
  // slash, .git suffix, etc.) down to "owner/repo" for comparison against
  // the GitHub API's `full_name` field.
  export function normalizeRepoUrl(url: string): string {
	return url
	  .replace(/^https?:\/\/github\.com\//, "")
	  .replace(/\.git$/, "")
	  .replace(/\/$/, "")
	  .trim();
  }
  
  export function isBlacklisted(fullName: string): boolean {
	return REPO_BLACKLIST.map(normalizeRepoUrl).includes(fullName);
  }