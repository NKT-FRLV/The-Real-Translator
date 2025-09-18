# Grammar Check Testing Guide

## Mock Data Testing

### Setup
1. Open `GrammarCheckPage.tsx`
2. Set `useMockData = true` (line 73)
3. Save the file

### Test Cases

#### Perfect Mock Data
- **File**: `mockData.ts` → `perfectMockData`
- **What it tests**: Ideal response with correct positions
- **Expected behavior**: 
  - TextDiff shows proper highlighting
  - All positions are valid
  - Changes display correctly

#### Problematic Mock Data  
- **File**: `mockData.ts` → `problematicMockData`
- **What it tests**: Error handling with invalid positions
- **Expected behavior**:
  - TextDiff shows fallback message
  - Invalid positions are filtered out
  - Changes Summary still works

### Test Scenarios

#### Scenario 1: Perfect Data
```typescript
// In mockData.ts, change line 57:
return getMockData("perfect");
```
**Expected**: Clean highlighting, all changes visible

#### Scenario 2: Problematic Data
```typescript
// In mockData.ts, change line 57:
return getMockData("problematic");
```
**Expected**: Fallback display, error handling

### Test Text
Use this text for testing:
```
Hi, iiIwould toyouke to show to how to code
```

### What to Look For

#### ✅ Perfect Case
- Green highlighting for corrections
- Red strikethrough for deletions
- Proper position mapping
- All changes visible

#### ❌ Problematic Case
- "Changes detected but positions are invalid" message
- Changes Summary still shows
- Fallback to simple text comparison
- Error handling works

### Switching Between Modes

1. **Real API**: Set `useMockData = false`
2. **Perfect Mock**: Set `useMockData = true` + `getMockData("perfect")`
3. **Problematic Mock**: Set `useMockData = true` + `getMockData("problematic")`

### Debugging

- Check browser console for errors
- Verify position validation in TextDiff
- Test both mobile and desktop layouts
- Try different editing styles
