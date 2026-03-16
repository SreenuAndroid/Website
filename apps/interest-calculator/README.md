# Interest Calculator Pro - Support Pages

This directory contains the support website for Interest Calculator Pro, ready to be deployed to GitHub Pages.

## Files

- `index.html` - Main support page with FAQ
- `privacy.html` - Privacy Policy
- `terms.html` - Terms of Service

## Deployment to GitHub Pages

### Option 1: Deploy from this repo

1. Push this repository to GitHub
2. Go to repository Settings → Pages
3. Under "Source", select "Deploy from a branch"
4. Select branch: `main`
5. Select folder: `/apps/interest_calculator/docs`
6. Click Save

Your support page will be available at:

```
https://yourusername.github.io/flutter-apps/apps/interest_calculator/docs/
```

### Option 2: Create a dedicated repo (Recommended)

1. Create a new GitHub repository named `interest-calculator-support`
2. Copy the contents of this `docs` folder to the new repo
3. Go to repository Settings → Pages
4. Under "Source", select "Deploy from a branch"
5. Select branch: `main`, folder: `/` (root)
6. Click Save

Your support page will be available at:

```
https://yourusername.github.io/interest-calculator-support/
```

## Update Support URL in App Store Connect

Once deployed, use the GitHub Pages URL as your Support URL:

**For App Store Connect:**

```
https://yourusername.github.io/interest-calculator-support/
```

**For Privacy Policy:**

```
https://yourusername.github.io/interest-calculator-support/privacy.html
```

## Customization

Before deploying, update the following:

1. **Email Address**: ✅ Already set to `fairappsmobile@gmail.com`
2. **App Store Links**: Update the app store URLs when your app is published
3. **GitHub Links**: Update repository links to your actual GitHub username/repo
4. **Copyright**: Update the year and company name as needed

## Local Testing

To test locally, simply open `index.html` in a web browser:

```bash
open apps/interest_calculator/docs/index.html
```

Or use a simple HTTP server:

```bash
cd apps/interest_calculator/docs
python3 -m http.server 8000
# Visit http://localhost:8000
```
