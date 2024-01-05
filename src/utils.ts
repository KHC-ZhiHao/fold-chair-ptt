export const openToBrowser = (url: string) => {
    const shell = require('electron').shell
    shell.openExternal(url)
}
