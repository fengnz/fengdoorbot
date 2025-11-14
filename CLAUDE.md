# CLAUDE.md - FengDoorBot Development Guide for AI Assistants

## Project Overview

**FengDoorBot** is a Telegram group management bot built on Google Apps Script (GAS). It provides welcome messages, member verification, ban commands, and other group administration features. The bot is deployed at @FengDoorBot and is an open-source project under GNU GPL license.

**Key Information:**
- **Language**: JavaScript (ES3 compatible for Google Apps Script)
- **Platform**: Google Apps Script (deployed as a web app)
- **Database**: MongoDB via Restheart REST API
- **Bot Framework**: Telegram Bot API
- **Deployment Tool**: Google clasp CLI
- **Timezone**: Pacific/Auckland (New Zealand)
- **Project Author**: 峰哥 (Feng)

## Technology Stack

### Core Technologies
- **Google Apps Script**: Serverless JavaScript runtime in Google's cloud
- **Telegram Bot API**: For bot communication
- **MongoDB + Restheart**: NoSQL database with REST API interface
- **clasp**: Command-line tool for Google Apps Script projects

### Development Tools
- **ESLint**: Code linting with custom rules (ES3 compatibility)
- **Visual Studio Code**: Recommended IDE
- **Git**: Version control
- **bash scripts**: Automated deployment (run.sh, live.sh)

## Architecture

### Request Flow
```
Telegram Update → Google Apps Script Webhook (doPost)
    ↓
preparePayload(body) - Parse and route request
    ↓
Handler Functions (handleMessage, handleCallback, etc.)
    ↓
Telegram API Response + Database Operations
```

### Core Entry Point
**Code.js:doPost(e)** - Main webhook handler
- Receives POST requests from Telegram
- Parses JSON body
- Routes to appropriate handler via `preparePayload()`
- Sends response(s) back to Telegram API

## File Structure & Organization

### Configuration Files
```
Const.js              - Bot token, database credentials, collection names
appsscript.json       - GAS project settings, timezone, enabled services
.clasp.json           - Google Apps Script project ID
tsconfig.json         - TypeScript/JavaScript compiler options
.eslintrc.json        - ESLint rules (ES3 compatible)
jsconfig.json         - VS Code JavaScript configuration
```

### Core Logic Files
```
Code.js               - Main entry point (doPost webhook handler)
PreparePayload.js     - Request routing logic
HandleMessage.js      - Message event dispatcher
HandleMessageText.js  - Text message handler
HandleCallback.js     - Inline button callback handler
```

### Command Handlers
```
HandleAdminCommand.js       - /admin command for group settings
HandleBanCommand.js         - /ban command for banning users
HandleStartCommand.js       - /start command for private chats
HandleHelpCommand.js        - /help command
HandleDelMsgCommand.js      - Message deletion command
HandlePinMessageCommand.js  - Pin message command
HandleNotRobotCommand.js    - Anti-robot verification logic
HandleNoCommandAndAlias.js  - Command alias handling
handleInitDBCommad.js       - /initdb database initialization
```

### Feature Modules
```
NewMember.js          - New member welcome & verification logic
Group.js              - Group settings management
Permission.js         - Admin permission checks
InlineKeyboard.js     - Telegram inline keyboard generation
```

### API & Database
```
TelegramAPI.js        - Telegram API wrapper (postTelegram)
TelegramChat.js       - Chat-related API calls
Mongo.js              - MongoDB/Restheart REST API wrapper
Mlab.js               - Alternative mLab database support
Database.js           - Database helper functions
```

### Utilities
```
Common.js             - Shared utility functions
Context.js            - Context management
Array.js              - Array manipulation helpers
Get.js                - Data retrieval functions
```

### Testing & Deployment
```
Test.js               - Test functions
testData.js           - Test data for development
Automated.js          - Scheduled tasks (removePendingUsers)
run.sh                - Development deployment script
live.sh               - Production deployment script
```

## Key Components Deep Dive

### 1. Constants & Configuration (Const.js)

**Critical Configuration:**
```javascript
Const.botToken        - Telegram bot token (MUST be changed)
Const.myId            - Bot's numeric ID
Const.myName          - Bot's username
Const.restheartUrl    - MongoDB Restheart API endpoint
Const.restheartUser   - Database username
Const.restheartPass   - Database password
```

**Database Collections:**
```javascript
Const.memberColl      = "members"          - Member verification records
Const.contextColl     = "context"          - User context for multi-step commands
Const.logColl         = "logs"             - Error and activity logs
Const.groupSettingsColl = "group-settings" - Per-group configuration
Const.toTelegram      = "to-telegram"      - Outgoing message logs
Const.fromTelegram    = "from-telegram"    - Incoming message logs
```

### 2. Message Handling Flow

**HandleMessage.js** dispatches based on update type:
- `body.message.new_chat_member` → `handleNewMember()`
- `body.message.text` → `handleMessageText()`

**HandleMessageText.js** parses commands and routes:
- Extracts command from text (e.g., `/admin`, `/ban`)
- Checks if message is for this bot (handles @mentions)
- Routes to specific command handlers

### 3. Database Operations (Mongo.js)

**Restheart wrapper functions:**
```javascript
mongo.insert(collection, data)           - POST new document
mongo.replace(collection, query, data)   - PUT replace document
mongo.setOne(urlWithId, data)           - PATCH update by ID
mongo.setMany(collection, query, data)  - PATCH update many
mongo.remove(collection, query)         - DELETE documents
mongo.get(collection, query)            - GET documents
```

**Query Format:**
```javascript
// Filter example
var query = "filter=" + JSON.stringify({
  "user.id": userId,
  "chat.id": chatId
});
mongo.get(Const.memberColl, query);
```

### 4. Telegram API Integration (TelegramAPI.js)

**postTelegram(payload)** - Main function to call Telegram API
- Automatically truncates messages > 4096 characters
- Logs requests/responses to database
- Handles errors gracefully
- Returns parsed JSON response

**Payload Structure:**
```javascript
{
  "method": "sendMessage",     // API method name
  "chat_id": "123456",          // Target chat
  "text": "Message text",       // Message content
  "parse_mode": "markdown",     // Optional: HTML or markdown
  "reply_markup": {...}         // Optional: keyboards
}
```

### 5. New Member Handling (NewMember.js)

**Two modes:**
1. **Verification Mode** (`notRobot.status == "on"`):
   - Restricts new member (mutes)
   - Sends verification button
   - Stores in `members` collection with timeout
   - `Automated.js:removePendingUsers()` kicks expired users

2. **Welcome Only Mode**:
   - Sends welcome message immediately
   - Optional 30-second auto-delete
   - Supports custom variables: `$(newMemberName)`, `$(desc)`, `$(pinnedMessage)`

### 6. Admin Commands (HandleAdminCommand.js)

**Command Structure:**
```
/admin <feature> <setting> <value>

Examples:
/admin notrobot status on
/admin notrobot timeout 120
/admin welcome status on
/admin welcome custom on
/admin welcome customtext Welcome $(newMemberName)!
```

**Permission Check:**
- Must be in a group (not private chat)
- Must be group admin or creator
- Special permission for user ID 539065210 (Feng)

### 7. Common Utilities (Common.js)

**Key Functions:**
```javascript
getShareObject(body)           - Extract common data from update
isAdminOrCreator(userId, chatId) - Check admin permissions
getMentionName(user)           - Create Telegram mention link
getMarkDownUrl(text, url)      - Format markdown links
escapeMarkDown(text)           - Escape markdown special chars
getName(user)                  - Get user's full name
isPrivate(body)                - Check if chat is private
getChineseDateString(date)     - Format date in Chinese
shuffle(array)                 - Randomize array order
```

## Development Workflow

### Initial Setup

1. **Clone Repository:**
   ```bash
   git clone <repository-url>
   cd fengdoorbot
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Configure Bot:**
   - Edit `Const.js`:
     - Replace `Const.botToken` with your bot token
     - Update `Const.myName` with your bot username
     - Configure database credentials (or use provided public DB)

4. **Install clasp:**
   ```bash
   npm install -g @google/clasp
   clasp login
   ```

5. **Create/Link GAS Project:**
   - **Option A - New Project:**
     ```bash
     clasp create --title "My Telegram Bot"
     ```
   - **Option B - Existing Project:**
     ```bash
     clasp clone <scriptId>
     ```

6. **Push Code:**
   ```bash
   clasp push
   ```

7. **Deploy as Web App:**
   - Visit https://script.google.com/home
   - Open your project
   - Click "Deploy" → "New deployment"
   - Type: "Web app"
   - Execute as: "Me"
   - Who has access: "Anyone"
   - Copy the web app URL

8. **Set Telegram Webhook:**
   ```bash
   curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=<YOUR_WEB_APP_URL>"
   ```

9. **Initialize Database:**
   - Send `/initdb` command to your bot
   - This creates required collections

### Making Changes

1. **Edit Code:**
   - Make changes in VS Code or your preferred editor
   - Follow ES3 syntax (no arrow functions, let/const, etc.)

2. **Push to Google:**
   ```bash
   clasp push
   ```

3. **Deploy Update:**
   - **Option A - Manual (for testing):**
     - Visit Google Apps Script web interface
     - Create new deployment version
     - Link it to test bot

   - **Option B - Automated (recommended):**
     ```bash
     ./run.sh  # For development/test bot
     ```

4. **Test:**
   - Send commands to your bot
   - Check responses
   - Monitor errors in GAS logs

### Debugging

**Test Functions:**
```javascript
// In any .js file, create debug function:
function debugMyFeature() {
  debug();  // Uses testData.js
}
```

**Access Logs:**
- GAS Web Interface → Executions
- Check `logs` collection in MongoDB
- Use `console.log()` for debugging

**Common Issues:**
- **Webhook not working**: Check deployment URL in Telegram webhook
- **Database errors**: Verify Restheart credentials and collection names
- **Permission errors**: Ensure bot is admin in test group

## Coding Conventions

### JavaScript Version
**ES3 Compatible** - Google Apps Script limitations:
- Use `var`, not `let` or `const`
- Use `function() {}`, not arrow functions `() =>`
- Use `.join()` instead of template literals
- Use bracket notation for reserved words: `object['delete']`

### Code Style

**Function Naming:**
- camelCase: `handleMessage()`, `getShareObject()`
- Debug functions: `debugFunctionName()` for each module

**File Organization:**
- One main function per file (generally)
- Debug function at top of each file
- Related functionality grouped together

**Comments:**
- Chinese comments common (original author is Chinese-speaking)
- Add English comments when making changes
- Document complex logic

**Error Handling:**
```javascript
try {
  // risky operation
} catch (e) {
  var errorLog = {
    type: "error",
    error: e,
    context: {...}
  };
  mongo.insert(Const.logColl, errorLog);
}
```

### ESLint Rules
- Follows `.eslintrc.json` configuration
- Key rules:
  - `"ecmaVersion": 3` - ES3 compatibility
  - `"no-var": "off"` - Allow var
  - `"prefer-const": "error"` - But prefer const when possible (disabled in practice)
  - Function declarations preferred over expressions

### Telegram Markdown
- Use `escapeMarkDown()` for user-generated content
- Format links: `[text](url)`
- Mention users: `[name](tg://user?id=123)`
- Escape characters: `_`, `*`, `[`, `]`, `` ` ``

## Database Structure

### Collections

**1. members** - Verification tracking
```javascript
{
  status: "pending" | "verified" | "kicked",
  date: 1234567890,              // Unix timestamp
  timeout: 120,                  // Seconds until kick
  user: {...},                   // Telegram user object
  chat: {...},                   // Telegram chat object
  message: {...}                 // Verification message to delete
}
```

**2. group-settings** - Per-group configuration
```javascript
{
  chatId: "123456",
  welcome: {
    status: "on" | "off",
    killme: "on" | "off",        // 30-second auto-delete
    desc: "on" | "off",          // Include description
    pinned: "on" | "off",        // Include pinned message
    custom: "on" | "off",        // Use custom text
    customtext: "Welcome $(newMemberName)!"
  },
  notRobot: {
    status: "on" | "off",
    timeout: 120                 // Seconds
  }
}
```

**3. logs** - Error and activity logs
```javascript
{
  type: "error" | "restheart-response",
  error: {...},
  timestamp: ...
}
```

**4. context** - Multi-step command state
```javascript
{
  userId: "123",
  chatId: "456",
  state: "waiting_for_input",
  data: {...}
}
```

## Deployment Process

### Development (Test Bot)

1. **Update run.sh:**
   ```bash
   deployId=<your-test-deployment-id>
   ```

2. **Deploy:**
   ```bash
   ./run.sh
   ```
   - Pushes code with `clasp push`
   - Deploys to specified deployment ID
   - Changes take effect immediately

### Production (Live Bot)

1. **Update live.sh:**
   ```bash
   deployId=<your-live-deployment-id>
   ```

2. **Deploy:**
   ```bash
   ./live.sh
   ```

**IMPORTANT**: Test thoroughly before deploying to production!

### Manual Deployment

1. `clasp push`
2. Visit https://script.google.com/home
3. Open project
4. "Deploy" → "Manage deployments"
5. Click edit (pencil icon) on deployment
6. "New version"
7. Save

## Important Notes for AI Assistants

### When Making Changes

1. **ALWAYS maintain ES3 compatibility:**
   - Don't introduce `let`, `const`, arrow functions, template literals
   - Use `var` and function declarations

2. **Test before committing:**
   - Use debug functions with `testData.js`
   - Verify in actual Telegram group if possible

3. **Database operations:**
   - Always use the `mongo` wrapper (Mongo.js)
   - Remember to encode queries: `encodeURI()`
   - Check Restheart documentation for query syntax

4. **Telegram API limits:**
   - Messages limited to 4096 characters (handled in postTelegram)
   - Be careful with markdown formatting
   - Always escape user input with `escapeMarkDown()`

5. **Security concerns:**
   - Never commit real bot tokens (use placeholders)
   - Validate admin permissions before privileged operations
   - Sanitize user input to prevent injection

6. **Async behavior:**
   - GAS doesn't support async/await
   - All operations are synchronous
   - Use `Utilities.sleep()` for delays (milliseconds)
   - Callbacks can be added via `payload.callback` property

### Common Patterns

**Creating a new command handler:**
```javascript
function handleMyCommand(body, paras, origParas) {
  var share = getShareObject(body);
  var payload = share.payload;

  // Check permissions if needed
  if (!isAdminOrCreator(share.from.id, share.chat.id)) {
    payload.text = "Permission denied";
    return payload;
  }

  // Your logic here
  payload.text = "Response text";

  return payload;
}
```

**Database query pattern:**
```javascript
// Find documents
var query = "filter=" + JSON.stringify({
  "chatId": chatId
});
var results = mongo.get(Const.groupSettingsColl, query);

// Update document
var updateData = {"$set": {field: value}};
mongo.setOne(collection + "/" + docId, updateData);

// Insert document
mongo.insert(collection, {data: "value"});

// Delete documents
mongo.remove(collection, query);
```

**Inline keyboard pattern:**
```javascript
var buttons = [];
buttons.push({
  text: "Button Label",
  callback_data: "command:param"
});

var inlineKeyboardMarkup = generateInlineKeyboardMarkup(buttons, 3); // 3 = columns
payload.reply_markup = inlineKeyboardMarkup;
```

### File References
When suggesting changes, always reference files by their exact names:
- `Code.js:4` - Line 4 of Code.js
- `HandleAdminCommand.js:45` - Line 45 of HandleAdminCommand.js

### Testing Strategy
1. Use debug functions with testData.js for initial testing
2. Test in private chat first (if applicable)
3. Test in a test group with bot as admin
4. Deploy to development deployment before production
5. Monitor GAS execution logs and database logs collection

### Resources
- **Telegram Bot API**: https://core.telegram.org/bots/api
- **Google Apps Script**: https://developers.google.com/apps-script
- **Restheart**: https://restheart.org/docs/
- **clasp**: https://github.com/google/clasp
- **Project Author's Resources**:
  - YouTube: Video tutorials on building Telegram bots
  - Telegram Group: https://t.me/fengsharegroup
  - Blog: https://www.dengnz.com/

## Scheduled Tasks (Triggers)

### Automated.js Functions

**removePendingUsers()** - Should run every 1-5 minutes:
- Finds all members with `status: "pending"`
- Checks if verification timeout expired
- Kicks expired users (bans for 1 minute)
- Updates member status to "kicked"
- Deletes verification message

**Setup in GAS:**
1. Open project in script.google.com
2. Left sidebar → "Triggers" (clock icon)
3. "Add Trigger"
4. Function: `removePendingUsers`
5. Event source: "Time-driven"
6. Type: "Minutes timer"
7. Interval: "Every minute" or "Every 5 minutes"

## Git Workflow

### Branching
- Development happens on feature branches with format: `claude/claude-md-*`
- Never push directly to main without permission
- Always use: `git push -u origin <branch-name>`

### Committing
- Write clear commit messages
- Reference issue numbers if applicable
- Use git bash for running shell scripts (run.sh, live.sh)

### Important Files NOT in Git
- `.clasp.json` - May contain sensitive script ID
- `node_modules/` - In .gitignore
- Local test data with real tokens

## Conclusion

This codebase is a production Telegram bot serving real users. When making changes:
- Prioritize stability and backward compatibility
- Test thoroughly before deploying
- Consider the impact on existing groups using the bot
- Maintain the ES3 compatibility for GAS
- Follow the established patterns and conventions
- Document your changes clearly

For questions or contributions, refer to the original README.md or join the Telegram group at https://t.me/fengsharegroup.
