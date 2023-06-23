# AudioPlayer functionality
Let's define the requirements here so the AI can parse it in the future. And, of course, for ourselves.

First, the audio player is meant to play recordings of the Dao. These are either AI generated, or recorded by me, or someone else.

These files will be served via CDN (I'm using Cloudflare) over the Internet.

These files can be cached, whether automatically when fetched by the service worker or explicitly using IndexedDB. They can be played for offline use.

Every verse will display a small Play/Pause button next to it. Whenever the user presses the Play/Pause button, it will play the audio for that particular verse (while pausing the audio for all other verses.)

When playing, the footer will appear and show the audio player plus the name of the verse that's playing.





