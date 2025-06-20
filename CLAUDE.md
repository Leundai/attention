# Claude Memories

## Project Overview

This is a monorepo project that attempts to connect mutliple parts of the application. They are all separated and managed
by Turborepo.

Review @README for a structure overview of the project. This provides the basic understand and structure of how
the code is distributed across the repository.

There are also some basic commands that are defined in that README. Take into consideration that each package and page has
its own `package.json`. To get started, please look at the root directory @package.json

## Technical Stack

- **Framework:** React 19 with TypeScript
- **Build Tool:** Vite
- **Build System:** Turborepo
- **Styling:** Tailwind CSS and Shadcn
- **Storage**: Built-in Chrome Storage API as per @packages/storage
- **State Management**: Context API and useState
- **Testing:** Currently mainly e2e tests under @tests/e2e

## App Specific Architecture

### Extension Components

- **chrome-extension/injected:** File-based JS injection to monkey-patch fetch/xhr requests for body capture
- **pages/content:** Injects the `injected.js` file and listens to messages from the script and redirects to background.js
- **chrome-extension/background:** Handles parsing captured requests from fetch/xhr that are sent from pages/content.
In finality, it sends a cleaned-up/sanitized set of posts to the async backend process.

## Development Context

### Browser Compatibility

- **Primary Target:** Chrome/Chromium browsers
- **Manifest Version:** V3
- **Current Chrome Version:** Chrome 137

## Code Patterns and Preferences

### TypeScript Configuration

- **Strict Mode:** Enabled
- **Type/Interface Naming:** PascalCase

### React Patterns

- **Component Style:** Functional components with hooks
- **Component Props:** Affix with -Props and destructure props
- **State Management:** Context API
- **Styling Approach:** Tailwind with Shadcn

### Prettier Settings

- See @.prettierrc and @.prettierignore for specific settings

### Eslint Settings

- See @.eslint.config.ts for specific setup on how we will lint

## Key Files and Their Purpose

### Configuration Files

- `manifest.json` - Extension manifest (auto-generated)
- `vite.config.ts` - Vite build configuration
- `tsconfig.json` - TypeScript configuration
- `package.json` - Dependencies and scripts

## Development Guidelines

### When Helping with Code

1. **Always consider Chrome Extension context** - Remember this code runs in extension environment
2. **Follow the existing boilerplate patterns** - Maintain consistency with the template structure
3. **Consider security implications** - Chrome extensions have specific security requirements
4. **Think about user experience** - Extension UI should be intuitive and fast

### Common Tasks You Might Help With

- Adding new extension permissions
- Implementing content script functionality
- Creating popup UI components
- Setting up message passing between extension parts
- Debugging Chrome extension specific issues
- Optimizing build configuration
- Adding new features while maintaining extension architecture
- However, remain flexibile in your capabilities. We can decompose and tackle **ANY** complex problem

## Resources and References

### Documentation

- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)

## Notes for Claude

### Command runnings

- Always assume that you'll be running `pnpm` from root directory. Unless otherwise told to do so. Do not run specific `pnpm`
within any other subdirectory.
- Assume that I have ran `pnpm dev` on the side with HMR activated. Do let me know though if we have to restart that when
HMR won't pick it up.

### Helpful Context

- This extension uses Manifest V3 (the latest Chrome extension standard)
- The boilerplate handles most build configuration automatically
- Hot reload is available for development
- The project structure separates concerns between different extension components

### When Providing Code Examples

- Use TypeScript syntax
- Follow React functional component patterns
- Include proper Chrome extension API usage
- Consider the extension's security context (Content Security Policy)
- Provide complete, working examples when possible

### Testing Considerations

- Extension testing requires loading unpacked extensions in Chrome
- Content scripts interact with web pages directly
- Background scripts have limited DOM access
- Popup testing requires extension popup to be open

### Memory Management

- Create a Claude.backup.md which stores the original state of this Claude.md file.
- After creating a copy make use of this current Claude.md to add helpful context on the current task at hand
- Once we are done with the task at hand swap the backup to be the current Claude.md. We do not want to commit into github
any context specific changes as we modify Claude.md

---

**Last Updated:** 06/15/2025
**Node.js Version:** Defined in @nvmrc
