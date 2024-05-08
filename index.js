if (process.argv.length < 3) {
    console.log('Usage: ' + __filename + ' wss://<server>:[<port>] <call_from> <call_to>')
    console.log('Example: ' + __filename + ' wss://localhost:8080 01234567890 09876543210')
    process.exit(-1)
}

const call_from = process.argv[3]
const call_to = process.argv[4]

const WebSocket = require('ws')

const ws = new WebSocket(process.argv[2], {
    rejectUnauthorized: false
})

ws.on('open', function open() {
    ws.send(JSON.stringify({
        action: 'makeCall',
        data: {
            from: call_from,
            to: call_to
        }
    }))
})

ws.on('message', function incoming(data) {
    const message = JSON.parse(data)

    if (message.action === 'hangup') {
        console.log('Call ended')
        ws.close()
        process.exit(0)
    }

    console.log('Received message:', message)
})