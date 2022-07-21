Module.register("MMM-RTSP", {
  defaults: {
    streams: [],
    wsPort: 2000, // should be unique.
    startStreamId: 0,
    options: '',
    playerOptions: {}
  },
  
  getStyles: function () {
    return ["MMM-RTSP.css"]
  },

  getScripts: function () {
    return ["https://cdn.jsdelivr.net/npm/rtsp-relay/browser/index.js"]
  },

  start: function () {
    this.currentStreamId = this.config.startStreamId
    this.streamList = null
    
  
    this._domReady = new Promise((resolve, reject) => {
      this._domCreated = resolve
    })
    this._serverReady = new Promise((resolve, reject) => {
      this._serverReadied = resolve
    })

    Promise.allSettled([this._domReady, this._serverReady]).then(result => {
      this.startPlayer()
    })

    this.sendSocketNotification('CONFIG', this.config)
  },

  startPlayer: function () {
    console.group(this.identifier)
    console.log(this.streamList)

    console.groupEnd(this.identifier)
    loadPlayer({
      url: `ws://` + location.hostname + (this.streamList.find((s) => {
        return (s.index === this.config.startStreamId)
      })?.['url'] ?? ''),
      canvas: document.getElementById('RTSP_' + this.identifier),
      onPlay: (player) => { return this.playerOnPlay(player, this.config.startStreamId) },
      onPause: (player) => { return this.playerOnPause(player, this.config.startStreamId) },
      onDisconnect: (player) => { return this.playerOnDisconnect(player, this.config.startStreamId) },
      onSourceEstablished: (source) => {
        console.log('source', source)
      },
      ...this.config.playerOptions
    })
  },

  getDom: function () {
    let dom = document.createElement('canvas')
    dom.id = 'RTSP_' + this.identifier
    dom.classList.add('RTSP_PLAYER')
    return dom
  },

  notificationReceived: function (noti, payload, sender) {
    if (noti === 'DOM_OBJECTS_CREATED') {
      this._domCreated(true)
    }
  },

  socketNotificationReceived: function (noti, payload) {
    if (noti === 'SERVER_READY') {
      this.streamList = payload
      this._serverReadied(true)
    }

  },

  playerOnPause: function (player, i) {
    Log.log('Player is paused.', i)
  },

  playerOnPlay: function (player, i) {
    Log.log('Player is playing.', i)
  },

  playerOnDisconnect: function (player, i) {
    Log.log('Player is disconnected', i)
  }
})