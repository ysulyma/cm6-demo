This demonstrates how to use [rp-codemirror](https://github.com/ysulyma/rp-codemirror/) to make interactive code recordings with [CodeMirror 6](https://codemirror.net/6/).

## Installation

Clone this repository, then do

```bash
npm install
```

## Recording

To record, first make sure that `rp-recording` tags are enabled in `index.html`. Then compile in **development** mode:

```bash
webpack --watch
```

Now open the page and click on the recording (circle) icon in the controls. You can customize the keyboard commands for recording, but these must match what is given to `passThrough` in `src/development/HTMLBooth.tsx`.

Select Markers and Code for recording (to record Audio, you must access the page over HTTPS). Use the keyboard command to start/stop recording. Then:

1. Save the audio file (if any) to `audio/audio.webm`.

2. Copy the markers to `src/markers.ts`.

3. Copy the code recording to `src/recordings.ts`.

## Replaying

To view the code recording, change `src/production/media-url.ts` to export `"."`. (Once you are satisfied with your recording, you should upload your audio files to a static assets host and put that as the media URL instead.) Then compile in **production** mode:

```bash
NODE_ENV=production webpack
```

You should also remove the `rp-recording` tags from `index.html`, or else your viewers will get harassed about being asked for audio permissions. Probably there is a cleaner way to do this.

## Mastering

See the [Mastering guide](https://ractive-player.org/docs/guide/mastering#audio) for how to fix the browser recording (which doesn't come with the metadata needed for seeking) and convert it to mp4.

To generate thumbnail previews for the ractive, use [`rp-master thumbs`](https://ractive-player.org/docs/rp-master/thumbs). These should again be uploaded to your static assets host.

To produce a static rendering of the ractive, use [`rp-master render`](https://ractive-player.org/docs/rp-master/render/).

## Remotion

To compile the Remotion code:

```bash
cd remotion
./node_modules/.bin/webpack --watch
```

## Tips

Beware that `@env` is a magic directory that refers to either `src/development` or `src/production` depending on `NODE_ENV`. This is specified in `webpack.config.js`.

If you would like to have the recordings automatically saved, rather than having to copy them into a file, `rp-recording` is designed to allow this. It is not documented yet, but if you look in the `rp-recording` source, you can create your own `RecordingManager` and get the data from that. You would then submit the recording data to an AJAX endpoint (on a server) which would write the data to disk.
