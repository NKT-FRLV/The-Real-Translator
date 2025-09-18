# Grammar Check Setup

## Environment Variables

Add the following environment variable to your `.env.local` file:

```bash
# Grammar Check Model (optional, defaults to gpt-4o-mini)
GRAMMAR_MODEL=gpt-4o-mini

# OpenRouter API Key (required for AI functionality)
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

## Available Models

You can use any model supported by OpenRouter for grammar checking. Some recommended models:

- `gpt-4o-mini` - Fast and cost-effective (default)
- `gpt-4o` - More accurate but slower
- `claude-3-5-sonnet` - Excellent for grammar and style
- `llama-3.1-405b` - Good balance of speed and accuracy

## Features

- ✅ **Reliable AI Integration**: Uses `generateObject` with Zod schema validation
- ✅ **Real-time grammar checking** with AI
- ✅ **Multiple editing styles** (formal, informal, pirate, elf, etc.)
- ✅ **Detailed error explanations** with precise positioning
- ✅ **Visual text diff** with accurate highlighting
- ✅ **Auto-regeneration** when editing style changes
- ✅ **Mobile-first responsive design**
- ✅ **Dark/light theme support**
- ✅ **Toast notifications** for errors
- ✅ **Type-safe** with TypeScript and Zod validation

## API Endpoint

The grammar check functionality is available at:
- **POST** `/api/grammar`

### Request Body
```json
{
  "text": "Your text to check",
  "style": "neutral" // or "formal", "informal", "pirate", "elf", etc.
}
```

### Response
Returns a validated JSON response with:
- `correctedText`: The improved version of the text
- `changes`: Array of text changes with exact positions
- `errors`: Array of detailed error explanations

**Key Improvements:**
- ✅ **Zod validation** ensures correct response format
- ✅ **Aggressive corrections** for messy text (cleans up "мммм", "аааа", "...")
- ✅ **Smart text rewriting** when content is unclear
- ✅ **Exact position calculation** for precise highlighting
- ✅ **Fallback display** when positions are invalid

## Usage

1. Enter text in the input field
2. Select an editing style
3. Click "Check Grammar" or press `Ctrl + /`
4. Review the AI suggestions in the modal
5. Apply changes or regenerate with different style
