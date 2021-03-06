'use strict'

const URL = require('url-parse')
const platform = require('./platform')
const coalesce = require('koalas')

class Config {
  constructor (options) {
    options = options || {}

    const enabled = coalesce(options.enabled, platform.env('DD_TRACE_ENABLED'), true)
    const debug = coalesce(options.debug, platform.env('DD_TRACE_DEBUG'), false)
    const protocol = 'http'
    const hostname = coalesce(options.hostname, platform.env('DD_TRACE_AGENT_HOSTNAME'), 'localhost')
    const port = coalesce(options.port, platform.env('DD_TRACE_AGENT_PORT'), 8126)

    this.enabled = String(enabled) === 'true'
    this.debug = String(debug) === 'true'
    this.service = coalesce(options.service, platform.env('DD_SERVICE_NAME'), platform.service())
    this.env = coalesce(options.env, platform.env('DD_ENV'))
    this.url = new URL(`${protocol}://${hostname}:${port}`)
    this.tags = coalesce(options.tags, {})
    this.flushInterval = coalesce(options.flushInterval, 2000)
    this.bufferSize = 100000
    this.sampleRate = 1
    this.logger = options.logger
    this.plugins = coalesce(options.plugins, true)
    this.experimental = {
      asyncHooks: isFlagEnabled(options.experimental, 'asyncHooks')
    }
  }
}

function isFlagEnabled (obj, prop) {
  return obj === true || (typeof obj === 'object' && obj !== null && obj[prop])
}

module.exports = Config
