# Pre-Flight Checks Feature

## Overview

Pre-flight checks are health validation mechanisms that run before using paid services (ElevenLabs, OpenAI) to ensure our application infrastructure is working correctly. This prevents unnecessary costs when internal services fail.

## Problem Statement

Previously, the application would:
1. Use paid services (ElevenLabs TTS, OpenAI Image Generation)
2. Then encounter failures with internal services (Faster-Whisper)
3. Result in wasted money and failed video generation

## Solution

Implement pre-flight checks that validate internal services before using paid services.

## Implementation

### 1. Faster-Whisper Pre-Flight Check

**Location**: `src/short-creator/ShortCreator.ts`

**Method**: `performPreFlightChecks(skipCaptions?: boolean)`

**Logic**:
```typescript
private async performPreFlightChecks(skipCaptions?: boolean): Promise<void> {
  // Skip Faster-Whisper check if captions are disabled
  if (skipCaptions) {
    logger.debug("Skipping Faster-Whisper pre-flight check (captions disabled)");
    return;
  }

  logger.debug("Performing pre-flight checks for Faster-Whisper");
  
  try {
    // Find the smallest WAV file in temp directory for testing
    const tempDir = this.config.tempDirPath;
    const wavFiles = fs.readdirSync(tempDir)
      .filter(file => file.endsWith('.wav'))
      .map(file => ({
        name: file,
        path: path.join(tempDir, file),
        size: fs.statSync(path.join(tempDir, file)).size
      }))
      .sort((a, b) => a.size - b.size);

    if (wavFiles.length === 0) {
      throw new Error("No WAV files found for Faster-Whisper testing");
    }

    const testWavFile = wavFiles[0];
    logger.debug({ testFile: testWavFile.name, size: testWavFile.size }, "Using smallest WAV file for Faster-Whisper test");
    
    // Try with current model first, then fallback to tiny if needed
    const modelsToTry = ['base', 'tiny'];
    let lastError: Error | null = null;
    
    for (const model of modelsToTry) {
      try {
        logger.debug({ model }, "Testing Faster-Whisper with model");
        
        // Test Faster-Whisper transcription with timeout
        const captions = await Promise.race([
          this.whisper.CreateCaption(testWavFile.path, "test", model),
          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error(`Faster-Whisper test timeout after 30 seconds with ${model} model`)), 30000)
          )
        ]);
        
        if (captions.length === 0) {
          throw new Error(`Faster-Whisper returned empty captions with ${model} model`);
        }
        
        logger.debug({ model }, "Pre-flight check passed: Faster-Whisper is working");
        return; // Success, exit the method
        
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        logger.warn({ model, error: lastError.message }, `Faster-Whisper test failed with ${model} model, trying next model`);
        
        // If this is not the last model, continue to next one
        if (model !== modelsToTry[modelsToTry.length - 1]) {
          continue;
        }
      }
    }
    
    // If we get here, all models failed
    throw lastError || new Error("All Faster-Whisper models failed");
    
  } catch (error) {
    logger.error({ error }, "Pre-flight check failed: Faster-Whisper is not working with any model");
    throw new Error(`Pre-flight check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
```

### 2. Integration Point

**Location**: `src/short-creator/ShortCreator.ts` - `createShort()` method

**Integration**:
```typescript
private async createShort(
  videoId: string,
  inputScenes: SceneInput[],
  config: RenderConfig,
  skipCaptions?: boolean,
  questionVideoData?: {
    specs: string[];
    unknownSpec: string;
    answer: string;
    scene1Duration: number;
    scene2Duration: number;
  },
): Promise<string> {
  // Pre-flight check: ensure Faster-Whisper is working before using paid services
  await this.performPreFlightChecks(skipCaptions);
  
  logger.debug(
    {
      inputScenes,
      config,
    },
    "Creating short video",
  );
  // ... rest of the method
```

## Benefits

### 1. Cost Protection
- Prevents using paid services when internal services fail
- Saves money on ElevenLabs API calls
- Saves money on OpenAI API calls

### 2. Better User Experience
- Faster failure detection (30 seconds vs 2+ minutes)
- Clear error messages about what's wrong
- No partial video generation that fails later

### 3. System Reliability
- Validates Faster-Whisper is actually working (not just health check)
- Uses real transcription test with existing audio files
- Handles timeout scenarios gracefully
- **Model Fallback**: Automatically tries 'base' model first, falls back to 'tiny' if base fails
- **Resilient Design**: Continues operation even if primary model fails

## Configuration

### Environment Variables

**Docker Compose**: `docker-compose.coolify.yml`
```yaml
environment:
  - WHISPER_MODEL=${WHISPER_MODEL:-base}  # Use 'base' instead of 'large-v3' for faster loading
  - WHISPER_FALLBACK_MODELS=base,tiny  # Fallback order: base -> tiny
```

### Model Selection

**Recommended Models** (in order of speed):
1. `tiny` - Fastest, lowest accuracy
2. `base` - Good balance (default)
3. `small` - Better accuracy, slower
4. `medium` - High accuracy, slow
5. `large-v3` - Highest accuracy, very slow (not recommended for production)

## Testing

### Manual Test

1. **Test Faster-Whisper directly**:
```bash
docker exec short-video-maker-short-creator-1 curl -X POST http://faster-whisper:5002/transcribe \
  -H "Content-Type: application/json" \
  -d '{
    "audio_path": "/app/data/temp/[smallest_wav_file].wav",
    "model": "base",
    "language": "tr",
    "compute_type": "int8",
    "device": "cpu",
    "num_workers": 1
  }'
```

2. **Test video creation**:
```bash
curl -X POST http://localhost:3123/api/short-video \
  -H "Content-Type: application/json" \
  -d '{
    "scenes": [
      {
        "text": "Test text for transcription",
        "searchTerms": ["test", "image"]
      }
    ],
    "config": {
      "paddingBack": 1500,
      "music": "chill",
      "voice": "5IRSuKNUc0nJnSPPuxMI",
      "orientation": "portrait"
    }
  }'
```

## Error Handling

### Common Errors

1. **"No WAV files found for Faster-Whisper testing"**
   - **Cause**: No audio files in temp directory
   - **Solution**: Ensure audio files exist or create test audio

2. **"Faster-Whisper test timeout after 30 seconds"**
   - **Cause**: Model loading too slow or service unresponsive
   - **Solution**: Use smaller model (tiny/base) or increase timeout

3. **"Faster-Whisper returned empty captions"**
   - **Cause**: Transcription failed or audio file corrupted
   - **Solution**: Check audio file quality and Faster-Whisper logs

### Logging

**Success Log**:
```
{"level":"debug","msg":"Pre-flight check passed: Faster-Whisper is working"}
```

**Failure Log**:
```
{"level":"error","error":"Pre-flight check failed: Faster-Whisper is not working","msg":"Pre-flight check failed: [specific error]"}
```

## Future Enhancements

### 1. Additional Service Checks
- Piper TTS health check
- FFmpeg availability check
- Remotion rendering test

### 2. Caching
- Cache pre-flight check results for short periods
- Avoid repeated checks for same session

### 3. Metrics
- Track pre-flight check success/failure rates
- Monitor average check duration
- Alert on repeated failures

## Related Issues

- **Issue**: Faster-Whisper timeout with large-v3 model
- **Solution**: Use base model for better performance
- **Status**: Resolved

- **Issue**: Paid services used before internal service validation
- **Solution**: Implement pre-flight checks
- **Status**: Implemented

## Implementation Status

- [x] Faster-Whisper pre-flight check implementation
- [x] Integration with createShort method
- [x] Docker configuration for base model
- [x] Error handling and logging
- [x] Documentation
- [ ] Additional service checks (future)
- [ ] Caching mechanism (future)
- [ ] Metrics collection (future)
