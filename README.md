Todos
- [ ] Mobile responsiveness
- [ ] Make all the titles hyperlinks
- [ ] First page load is very slow, maybe from all the audio files
- [ ] Custom audio player. Can find a headless library.
- [ ] More flexible popover orientations. Right now we have four—one for each corner. We can bump it up to eight so each corner can have two orientations.
- [ ] Definition popover is a little slow
- [ ] Ideally, clicking outside the popover onto the already-highlighted character shouldn't close the popover and then flash it again
- [ ] Make the popover accessible (super not accessible right now)
- [ ] Also make the popover headless, look at Headless UI or Radix UI for inspiration

# Description
Daodejing.app is a NextJS-based webapp that helps you read the Dao De Jing in its original Chinese and learn its meaning. It lists all 81 verses and provides an audio recording of each being read in its original Chinese. It also contains descriptions for each verse, which tries to explain the meaning in plainer Chinese.

Pressing on each character opens a definition popover.

In learning mode, you can mark each passage as "Learning". For now, learning means memorizing, since I am trying to memorize the Dao in its original Chinese. I should probably rename it to "Memorizing" instead of "Learning", to be more specific.

This app is intended to work offline, so you can always read the Dao on the airplane or other situations in which you lack signal. It should be fast and responsive, since its primary purpose is still to provide a good reading experience.

I haven't yet fully made it into a PWA yet, but it does already have offline capabilities by means of service worker, which means you can cache the audio recordings and descriptions for each verse.

There is user authentication, which currently just lets you OAuth using Github. This is necessary to save your memorization progress.

Memorization works by a `nextReview` date for each verse. The formula is pretty simple: exponentially grow the interval up to a max of one month based on your streak of successes.

## High-level problems
### Syncing progress acoss devices
This should work offline, but I should also be able to go online, sync progress to my desktop from my phone, or vice-versa, and handle conflicts.


# Picking translations
Configuration is interesting. Should we just have one translation for each verse that gets saved? A preferred translation for a verse?

Or just let it be set page-wide? I think configuration is necessary. Though, it's kind of impossible to do so on mobile.

There are a lot of choices here. So let's forget configuration for now, and just let the user switch between translations as necessary.

The thing is, there's an English page plus a regular description page with translations.



# English sources
- https://en.wikibooks.org/wiki/Dao_De_Jing
- http://www.acmuller.net/con-dao/daodejing.html#div-2
- https://www.gutenberg.org/files/49965/49965-h/49965-h.htm