# MMM-RTSP
MagicMirror module for RTSP Stream

(Documenting is not yet completed)


## Config
```js
{
  module: "MMM-RTSP",
  position: "top_left",
  header: 'RTSP - Front',
  config: {
    streams: [
      {
        rtsp: 'rtsp://rtsp.stream/pattern'
      },
      {
        rtsp: 'rtsp://Abcd1234efgh5678:Abcd1234efgh5678@192.168.178.145:554/live1'
      },
      {
        rtsp: 'rtsp://Abcd1234efgh5678:Abcd1234efgh5678@192.168.178.145:554/live0'
      }
    ],
    wsPort: 2000, // should be unique.
    startStreamId: 1,
  }
},
{
  module: "MMM-RTSP",
  position: "top_left",
  header: 'RTSP - Garage',
  config: {
    startStreamId: 2,
  }
},
```