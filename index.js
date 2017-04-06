const RtmClient = require('@slack/client').RtmClient
const RTM_EVENTS = require('@slack/client').RTM_EVENTS

const token = process.env.SLACK_TOKEN | ''
const rtm = new RtmClient(token, {
  logLevel: 'error',
  autoReconnect: true,
  autoMark: true
})
rtm.start()

rtm.on(RTM_EVENTS.MESSAGE, function handleRtmMessage(message) {
  console.log('Message:', message)
  const text = message.text

  var from = 0
  var to = 0

  // S = 大学 , 0
  // H = 八王子駅 , 2
  // M = みなみ野 , 1
  HtoS = /^行こうか/
  StoH = /^帰ろうか/
  StoM = /^買い出しかな/
  MtoS = /^歩こうか/

  if (StoH.test(text)) {
    from = 0
    to = 2
  }

  if (HtoS.test(text)) {
    from = 2
    to = 0
  }

  if (StoM.test(text)) {
    from = 0
    to = 1
  }

  if (MtoS.test(text)) {
    from = 1
    to = 0
  }

  if (from == 0 && to == 0) {
    return
  }

  res = `${codeToPlace(from)}から${codeToPlace(to)}までのルートを検索するよ.`
  rtm.sendMessage(res, message.channel)
  res2 = '検索中・・・'
  rtm.sendMessage(res2, message.channel)

  nextBus(from, to, message.channel)
})

function codeToPlace(placeCode) {
  if(placeCode == 0) {
    return '大学'
  }
  if(placeCode == 1) {
    return '八王子みなみ野駅'
  }
  if(placeCode == 2) {
    return '八王子駅南口'
  }
}

const axios = require('axios')
function nextBus(from, to, channel) {
  console.log(`${from} => ${to} のバス検索`)
  const baseUrl = 'http://namazu.top/school_bus/api/v1/next.json'
  axios.get(baseUrl, {
    params: {from, to}
  }).then(response => {
    const res = response.data
    var message = ''
    if(res.schedules && res.schedules.length >= 1) {
      const next = res.schedules[0]
      if(next.is_shuttle) {
        return `今バスは${next.interval}だよ.`
      }
      message += `次のバスは${next.departure_time}発だよ,\n`

      if (res.schedules.length >= 2) {
        const afterNext = res.schedules[1]
        if (afterNext.is_shuttle) {
          message += `そのあと${afterNext.interval}になるよ.`
        } else {
          message += `その次のバスは${afterNext.departure_time}発だよ.`
        }
      } else {
        message += 'そのバスは終バスだよ.'
      }
    } else {
      message = 'バスはないよ　頑張ってね'
    }
    return message
  }).then(msg => {
    console.log(msg)
    rtm.sendMessage(msg, channel)
  }).catch((ex) => {
    console.error(ex)
    rtm.sendMessage('ｱﾜ､ｱﾜﾜﾜﾜﾜﾜﾜﾜ....', channel)
  })
}