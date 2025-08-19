import fs from 'fs';

/**
 * Reads the changelog.md file and returns the header and any text below the current version,
 * stopping when it hits another version header.
 * @param {string} changelogPath - Path to the changelog.md file
 * @param {string} currentVersion - The version to extract (e.g., '1.0.6')
 * @returns {string} The changelog section for the current version
 */
export function getCurrentVersionChangelog(changelogPath, currentVersion) {
    const content = fs.readFileSync(changelogPath, 'utf-8');
    const lines = content.split(/\r?\n/);
    const versionHeader = `# ${currentVersion}`;
    let inSection = false;
    let result = [];

    for (const line of lines) {
        if (!inSection) {
            if (line.trim() === versionHeader) {
                inSection = true;
                result.push(line);
            }
        } else {
            // If we hit another version header, stop
            if (/^# \d+\.\d+\.\d+/.test(line.trim()) && line.trim() !== versionHeader) {
                break;
            }
            result.push(line);
        }
    }
    return result.join('\n').trim();
}
