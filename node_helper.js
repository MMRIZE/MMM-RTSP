const RTSP = require('rtsp-relay')
const express = require('express')
var NodeHelper = require("node_helper")
const Log = require('logger')



module.exports = NodeHelper.create({
  start: function() {
    this.port = null
    this.streams = []
    this.app = express()
  },

  socketNotificationReceived: function (noti, payload) {
    if (noti === 'CONFIG') {
      if (!this.port) this.port = payload?.wsPort ?? null 
      if (this.streams.length < 1 && Array.isArray(payload?.streams) && payload.streams.length > 0) {
        this.streams = payload.streams.map((strm, index) => {
          return {
            index: index,
            url: `:${this.port}/MMM-RTSP/${index}`,
            ...strm
          }
        })
        this.app = express()
        const { proxy } = RTSP(this.app)
        for (let i = 0; i < this.streams.length; i++) {
          this.app.ws(`/MMM-RTSP/${i}`, proxy({
            verbose: true,
            url: this.streams?.[i].rtsp || this.streams[0].rtsp,
          }))
        }
        this.app.listen(this.port)
        this.sendSocketNotification('SERVER_READY', this.streams)
      }
      
    }
  },
})