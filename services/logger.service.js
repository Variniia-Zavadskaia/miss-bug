import fs from 'fs'
import chalk from 'chalk'

// Initialize logger service
export const loggerService = {
    debug(...args) {
        doLog('DEBUG', ...args)
    },
    info(...args) {
        doLog('INFO', ...args)
    },
    warn(...args) {
        doLog('WARN', ...args)
    },
    error(...args) {
        doLog('ERROR', ...args)
    }
}

const logsDir = './logs'
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir)
}

// Define time format
function getTime() {
    let now = new Date()
    return now.toLocaleString('he')
}

function isError(e) {
    return e && e.stack && e.message
}

// Add color using chalk based on log level
function doLog(level, ...args) {
    const strs = args.map((arg) => (typeof arg === 'string' || isError(arg) ? arg : JSON.stringify(arg)))
    let line = strs.join(' | ')
    line = `${getTime()} - ${level} - ${line}\n`

    // Apply color based on log level
    switch (level) {
        case 'DEBUG':
            console.log(chalk.gray(line))
            break
        case 'INFO':
            console.log(chalk.blue(line))
            break
        case 'WARN':
            console.log(chalk.yellow(line))
            break
        case 'ERROR':
            console.log(chalk.red.bold(line))
            break
        default:
            console.log(line)
    }

    fs.appendFile('./logs/backend.log', line, (err) => {
        if (err) console.log('FATAL: cannot write to log file')
    })  
}