# Instructions to Add Wilson Bundi's Photo

## Step 1: Save Wilson's Photo
1. Save the Wilson Bundi photo you provided as: `wilson-bundi.jpg`
2. Copy this file to: `frontend/public/images/wilson-bundi.jpg`

## Step 2: Verify the File Path
Make sure the file is located at:
```
frontend/
  public/
    images/
      wilson-bundi.jpg  ← Wilson's photo should be here
```

## Step 3: Refresh the Website
1. Go to http://localhost:3000
2. Scroll down to the "Meet Our Leadership Team" section
3. Wilson's actual photo should now appear instead of the emoji

## What I've Updated in the Code:
- ✅ Updated Wilson Bundi's team member entry to use his actual photo
- ✅ Added fallback emoji (👨‍💻) in case photo doesn't load
- ✅ Styled the photo with proper sizing and border radius
- ✅ Added error handling to show emoji if photo fails to load

## Expected Result:
- Wilson's photo will appear as a circular image (120px x 120px) in the main team display
- Smaller version (60px x 60px) will appear in the team grid overview
- If photo doesn't load, it will fallback to the 👨‍💻 emoji

## File Format Requirements:
- **Format:** JPG, PNG, or WebP
- **Size:** Recommended 400x400px or larger (square aspect ratio works best)
- **File name:** Must be exactly `wilson-bundi.jpg`

Once you add the photo file, Wilson's actual photo will appear on the landing page! 🎉