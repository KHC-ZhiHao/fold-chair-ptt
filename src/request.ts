export function makeHttpsRequest(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const https = require('https')
        const options = {
            method: 'GET',
            headers: {
                Cookie: 'over18=1'
            }
        }

        const req = https.request(url, options, (res: any) => {
            let responseData = ''
            res.on('data', (chunk: any) => {
                responseData += chunk
            })
            res.on('end', () => {
                resolve(responseData)
            })
        })
        req.on('error', (error: any) => {
            reject(error)
        })
        req.on('timeout', () => {
            req.destroy()
            reject(new Error('Request timed out'))
        })
        req.setTimeout(5000)
        req.end()
    })
}
