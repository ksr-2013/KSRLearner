# KSR Learner Video Call Setup Guide

## 🎥 Overview

Your KSR Learner website now includes a fully functional video calling system powered by [Jitsi Meet](https://meet.jit.si/). This provides secure, high-quality video conferencing for online tutoring and learning sessions.

## ✨ Features

- **Real-time Video Calls**: High-quality video and audio communication
- **Screen Sharing**: Share your screen with students
- **Built-in Chat**: Text messaging during video calls
- **Recording**: Record sessions for later review
- **No Downloads**: Works directly in web browsers
- **Cross-Platform**: Compatible with desktop, tablet, and mobile
- **Secure**: End-to-end encrypted communications
- **Customizable**: Branded interface without Jitsi watermarks

## 🚀 Quick Start

### 1. Access Video Call Features

Navigate to the **Video Call** tab in your website navigation, or visit:
- `/video-call` - Main video call interface
- `/video-call/join` - Student join page
- `/video-call/test` - Test your setup

### 2. Start a Video Call

1. Go to `/video-call`
2. A unique room ID is automatically generated
3. Click the call button to start your session
4. Allow camera and microphone access when prompted

### 3. Students Join

Students can join your calls by:
1. Visiting `/video-call/join`
2. Entering the room ID you provide
3. Entering their name
4. Clicking "Join Video Call"

## 🔧 Technical Details

### Jitsi Meet Integration

The system uses Jitsi Meet's external API to embed video calling directly into your website:

```typescript
// Load Jitsi Meet script
const script = document.createElement('script')
script.src = 'https://meet.jit.si/external_api.js'

// Initialize video call
const api = new window.JitsiMeetExternalAPI('meet.jit.si', {
  roomName: 'your-room-id',
  width: '100%',
  height: '100%',
  // ... configuration options
})
```

### Browser Requirements

- **Modern browsers** with WebRTC support
- **HTTPS connection** (required for camera/microphone access)
- **Camera and microphone permissions**

## 📱 Usage Instructions

### For Teachers

1. **Start a Session**:
   - Navigate to Video Call tab
   - Click "Start Video Call"
   - Share the room ID with students

2. **During the Call**:
   - Use the toolbar for controls (mute, camera, screen share)
   - Monitor participants in the sidebar
   - Use chat for sharing resources

3. **End the Session**:
   - Click the hangup button
   - Confirm when prompted

### For Students

1. **Join a Session**:
   - Get the room ID from your teacher
   - Visit the student join page
   - Enter room ID and your name
   - Allow camera/microphone access

2. **Participate**:
   - Use chat for questions
   - Raise hand when needed
   - Follow teacher's instructions

## 🛠️ Customization

### Room ID Format

Room IDs can be customized:
- Use descriptive names: `ksr-math-class-123`
- Include dates: `ksr-2024-01-15-algebra`
- Add subject codes: `ksr-cs101-python-basics`

### Display Names

- Teachers: `KSR Learner Teacher`
- Students: Their actual names
- Customizable in the interface

### Branding

The interface is customized to remove Jitsi branding:
- No watermarks
- No "Powered by Jitsi" text
- Clean, professional appearance

## 🔒 Security Features

- **Unique Room IDs**: Each session has a unique identifier
- **No Persistent Storage**: Room data is not stored on servers
- **End-to-End Encryption**: Video calls are encrypted
- **Browser Security**: Uses standard web security protocols

## 🧪 Testing Your Setup

### Test Page

Use `/video-call/test` to verify:
1. Jitsi Meet loads correctly
2. Camera and microphone work
3. Video call functionality
4. Student joining process

### Testing Steps

1. **Open test page** in one browser tab
2. **Create a room** with a unique ID
3. **Open another tab** and go to `https://meet.jit.si/YOUR_ROOM_ID`
4. **Join the call** to test connectivity
5. **Test features** like chat, screen sharing, etc.

## 🚨 Troubleshooting

### Common Issues

1. **Camera/Microphone Not Working**:
   - Check browser permissions
   - Ensure HTTPS connection
   - Try refreshing the page

2. **Jitsi Not Loading**:
   - Check internet connection
   - Verify browser compatibility
   - Clear browser cache

3. **Students Can't Join**:
   - Verify room ID is correct
   - Check if room is active
   - Ensure students have proper permissions

### Error Messages

- **"Failed to load Jitsi Meet"**: Network or script loading issue
- **"Jitsi Meet failed to initialize"**: Browser compatibility issue
- **"Failed to create session"**: Configuration or API issue

### Support

If you encounter persistent issues:
1. Check browser console for errors
2. Verify all dependencies are loaded
3. Test with different browsers
4. Check network connectivity

## 📚 Advanced Features

### Screen Sharing

- Click the screen share button
- Select application or entire screen
- Students can see your shared content

### Recording

- Click the record button to start
- Recording indicator appears
- Files are saved locally

### Chat Integration

- Built-in text messaging
- Share links and resources
- Support for emojis and formatting

### Participant Management

- See who's online
- Monitor speaking indicators
- Manage permissions (if needed)

## 🌐 Deployment

### Production Considerations

1. **HTTPS Required**: Video calls need secure connections
2. **Domain Setup**: Ensure proper domain configuration
3. **Browser Support**: Test across different browsers
4. **Mobile Optimization**: Verify mobile functionality

### Performance

- **Bandwidth**: Video calls use significant bandwidth
- **CPU Usage**: Video processing is CPU-intensive
- **Memory**: Browser memory usage increases during calls

## 🔮 Future Enhancements

Potential improvements:
- **User Authentication**: Secure access control
- **Session Scheduling**: Calendar integration
- **Analytics**: Call duration and participation metrics
- **File Sharing**: Document and resource sharing
- **Breakout Rooms**: Group session management

## 📞 Support

For technical support or questions:
- Check the troubleshooting section above
- Review browser console for errors
- Test with the provided test page
- Ensure all requirements are met

---

**Powered by [Jitsi Meet](https://meet.jit.si/) - Secure, open-source video conferencing**
