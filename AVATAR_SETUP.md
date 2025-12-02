# 3D Avatar Models Setup

## Quick Setup

Since GLB files are binary and large, this project doesn't include a default avatar model in the repository. You need to add one yourself.

## Option 1: Ready Player Me (Recommended)

1. Visit [Ready Player Me](https://readyplayer.me/)
2. Create a custom avatar (free)
3. Download as GLB format
4. Save to `public/avatar-default.glb`

**Direct Download Example:**
```bash
# Replace [AVATAR_ID] with your avatar ID from Ready Player Me
curl -o public/avatar-default.glb "https://models.readyplayer.me/[AVATAR_ID].glb"
```

## Option 2: Download Free Models

### Mixamo (Adobe)

1. Visit [Mixamo](https://www.mixamo.com/)
2. Choose a character
3. Download as FBX
4. Convert to GLB using [online converter](https://products.aspose.app/3d/conversion/fbx-to-glb)
5. Save to `public/avatar-default.glb`

### Sketchfab

1. Visit [Sketchfab](https://sketchfab.com/)
2. Search for "avatar" or "character"
3. Filter by:
   - Free downloads
   - GLB format
   - Rigged
4. Download and save to `public/avatar-default.glb`

## Option 3: Create Your Own

Use tools like:
- [Blender](https://www.blender.org/) (free, open source)
- [Character Creator](https://www.reallusion.com/character-creator/)
- [VRoid Studio](https://vroid.com/en/studio) (anime style)

Export as GLB with:
- Facial blend shapes/morph targets
- T-pose or neutral pose
- Textures embedded

## Required Model Specifications

✅ **Format**: GLB (GLTF 2.0 binary)
✅ **Rigging**: Humanoid skeleton (optional but recommended)
✅ **Blend Shapes**: Facial morph targets for expressions
  - Mouth open/close
  - Eye blink
  - Smile
  - Eyebrows up/down

✅ **Size**: < 10MB (optimized)
✅ **Polygons**: < 100k triangles

## Common Blend Shape Names

The app looks for these morph target names:
- `mouthOpen` or `jawOpen`
- `eyeBlinkLeft` and `eyeBlinkRight`
- `mouthSmile`
- `browInnerUp`

## File Structure

```
public/
├── avatar-default.glb        # Default model (required)
├── avatar-female.glb          # Optional alternatives
└── avatar-male.glb            # Optional alternatives
```

## Testing Your Model

1. Place GLB file in `public/avatar-default.glb`
2. Run `npm run dev`
3. Check browser console for loading errors
4. Verify the avatar appears in the 3D scene

## Troubleshooting

**Avatar too big/small?**
- Adjust scale in `AvatarModel.tsx`:
```tsx
<group ref={groupRef} scale={[0.5, 0.5, 0.5]}>
```

**No facial animations?**
- Your model may lack blend shapes
- Check blend shape names in Blender or model viewer
- Update `AvatarModel.tsx` to match your model's blend shape names

**Model not loading?**
- Check file path is correct
- Verify GLB is valid using [glTF Validator](https://github.khronos.org/glTF-Validator/)
- Check browser console for errors

## Free Avatar Resources

- [Ready Player Me](https://readyplayer.me/) - Custom avatars
- [Mixamo](https://www.mixamo.com/) - Rigged characters
- [Sketchfab](https://sketchfab.com/3d-models?features=downloadable&sort_by=-likeCount) - Community models
- [Mozilla Hubs Avatars](https://github.com/mozilla/hubs-avatar-pipelines) - Open source
- [VRoid Hub](https://hub.vroid.com/) - Anime-style avatars

## Model Optimization

If your model is too large:

1. **Use [glTF-Pipeline](https://github.com/CesiumGS/gltf-pipeline)**:
```bash
npm install -g gltf-pipeline
gltf-pipeline -i input.glb -o output.glb -d
```

2. **Use [gltfjsx](https://github.com/pmndrs/gltfjsx)**:
```bash
npx gltfjsx public/avatar-default.glb
```

3. **Online Tool**: [glTF Transform](https://gltf.report/)

---

Once you have a model file at `public/avatar-default.glb`, the app will load it automatically!
