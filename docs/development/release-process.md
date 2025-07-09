# Release Process - notion-ai-tasks

## Release Flow (GitHub Releases + Automated Publishing)

```bash
# 1. Create release branch
git checkout -b release/vX.X.X

# 2. Update package.json and package-lock.json versions
npm version patch|minor|major --no-git-tag-version

# 3. Update README.md with new features/options
# 4. Update CLAUDE.md if project structure, practices, or guidelines changed
# 5. Test configuration examples
# 6. Commit and push release branch
git add .
git commit -m "bump version to X.X.X

- Feature 1: Description
- Feature 2: Description
- Bug Fix: Description
- Enhancement: Description"
git push origin release/vX.X.X

# 7. Create PR from release branch to main
# 8. After PR merge, create GitHub Release (triggers npm publish)
git checkout main
git pull origin main

# Option A: Using GitHub CLI (recommended)
gh release create vX.X.X --title "Release vX.X.X" --notes "
## Changes in this release:
- Feature 1: Description
- Feature 2: Description
- Bug Fix: Description
- Enhancement: Description

## Installation:
\`\`\`bash
npm install -g notion-ai-tasks@X.X.X
\`\`\`
"

# Option B: Using GitHub Web Interface
# Go to https://github.com/your-repo/releases/new
# - Tag: vX.X.X
# - Title: Release vX.X.X
# - Description: Copy release notes from commit
# - Click "Publish release"

# 9. GitHub Actions will automatically publish to npm when release is created
```

## Semantic Versioning Guidelines

### **PATCH (X.X.1)** - Bug fixes and small improvements:
```bash
npm version patch --no-git-tag-version
```
- Bug fixes that don't change API
- Documentation updates
- Internal refactoring without behavior change
- Performance improvements
- Security patches

### **MINOR (X.1.0)** - New features that are backward compatible:
```bash
npm version minor --no-git-tag-version
```
- New CLI commands or options
- New API methods or properties
- New configuration options (with defaults)
- Enhanced functionality that doesn't break existing usage
- New workflow files or templates

### **MAJOR (1.0.0)** - Breaking changes:
```bash
npm version major --no-git-tag-version
```
- Changes to existing API method signatures
- Removal of CLI commands or options
- Changes to configuration file structure requiring user updates
- Changes to default behavior that could break existing workflows
- Node.js version requirement changes

## Important Notes

### **For Releases:**
- **Always use release branches** for version updates
- **Both package.json AND package-lock.json** must be updated with same version
- **Use `--no-git-tag-version`** to prevent npm from creating tags locally
- **Include detailed release notes** in commit message
- **NEVER add Claude as Co-Authored-By** in release notes or commit messages
- **CRITICAL: Create GitHub Release** after PR merge to trigger npm publishing
- **GitHub Actions publishes to npm** when GitHub Release is created (not on PR merge)
- **Use GitHub CLI (`gh release create`)** for consistent release creation

## Maintenance Checklist

### **Before Release:**
- Version bumped in package.json
- README.md configuration section updated
- README.md Project Structure section matches actual files
- CLAUDE.md File Structure section matches actual files
- All workflow .md files tested
- No hardcoded values in code
- All configuration options documented

### **After Release PR Merge:**
- **MANDATORY: Create GitHub Release** to trigger npm publishing
- Verify GitHub Actions workflow completes successfully
- Check that new version appears on npm registry
- Update any dependent projects if needed

## Mandatory Updates

### **Always Update After Changes:**

1. **README.md** - Keep documentation current with new features
2. **package.json** - Bump version following semver
3. **Configuration examples** in all .md files
4. **CLAUDE.md** - Update this file if any project structure, guidelines, or practices change