import { load, CheerioAPI } from 'cheerio'
import { flow, text } from 'power-helper'
import { makeHttpsRequest } from './request'

type Push = {
    uid: string
    tag: string
    date: string
    user: string
    time: string
    link: string
    message: string
}

export const getFakeData = () => {
    return {
        url: 'https://www.ptt.cc/bbs/Stock/M.1689906475.A.C13.html',
        pushs: [
            {
                uid: '1234',
                tag: '噓',
                user: '123',
                date: '07-21',
                time: '10:28',
                link: '',
                message: '賭失敗的你有看到嗎？'
            }
        ],
        attrs: {
            date: 'Fri Jul 21 10:27:53 2023',
            title: '[請益] 重壓的勇氣？',
            author: 'dispptt (dispptt)',
            category: 'Stock'
        },
        content: '觀察多支潛力股都是有升一段之後...',
        findNewest: (): Promise<Push[]> => new Promise(resolve => resolve([]))
    }
}

const readPushs = ($: CheerioAPI): Push[] => {
    const output: Push[] = []
    $('.push').each((_index, el) => {
        let html = $(el).html()
        let $$ = load(html ?? '')
        let ipdatetime = $$('.push-ipdatetime').html()
        if (ipdatetime == null || ipdatetime.trim() === '') {
            return
        }
        let date = ipdatetime.trim().split('/').join('-').split(' ')
        let message = $$('.push-content').html()?.trim()
        if (message) {
            const content = $$('.push-content').html()?.trim().slice(1).trim() ?? ''
            output.push({
                uid: flow.createUuid(),
                tag: $$('.push-tag').html()?.trim() ?? '',
                user: $$('.push-userid').html()?.trim() ?? '',
                date: date[0],
                time: date[1],
                link: load(content)('a')?.text() ?? '',
                message: content
            })
        }
    })
    return output
}

export const readPTTArticle = async (url: string) => {
    let html = await makeHttpsRequest(url)
    let attrs = {
        date: 'Empty',
        title: 'Empty',
        author: 'Empty',
        category: 'Empty'
    }
    let $ = load(html)
    let content = $('#main-content')
        .text()
        .split('※ 發信站:')[0]
        .split('\n')
        .filter(e => !text.headMatch(e.trim().toLowerCase(), 'sent'))
        .filter(e => !!e.trim())
        .slice(1, -2)
        .join('\n')
        .trim()
    let values = $('.article-meta-value')
    $('.article-meta-tag').each((index, el) => {
        if ($(el).html() === '作者') {
            attrs.author = $(values[index]).html() ?? ''
        }
        if ($(el).html() === '看板') {
            attrs.category = $(values[index]).html() ?? ''
        }
        if ($(el).html() === '標題') {
            attrs.title = $(values[index]).html() ?? ''
        }
        if ($(el).html() === '時間') {
            attrs.date = $(values[index]).html() ?? ''
        }
    })
    const pushs = readPushs($)
    const pool = {
        url: $('#article-polling').attr('data-pollurl'),
        longpollurl: $('#article-polling').attr('data-longpollurl')
    }
    const findNewest = async(): Promise<Push[]> => {
        const pushs: Push[] = []
        while (true) {
            const longUrl = new URL(`https://www.ptt.cc${pool.longpollurl}`)
            const longPoolData = JSON.parse(await makeHttpsRequest(longUrl.href))
            const url = new URL(`https://www.ptt.cc${pool.url}&size=${longPoolData.size}&size-sig=${longPoolData.sig}`)
            const data = JSON.parse(await makeHttpsRequest(url.href))
            pool.url = data.pollUrl
            const $ = load(data.contentHtml)
            const newPushs = readPushs($)
            if (newPushs.length === 0) {
                break
            }
            pushs.push(...newPushs)
        }
        return pushs
    }
    return {
        url,
        pushs,
        attrs,
        content,
        findNewest
    }
}

export const fetchPTTArticles = async(category: string) => {
    let baseUrl = 'https://www.ptt.cc'
    let html = await makeHttpsRequest(text.headMatch(category, 'http') ? category : `${baseUrl}/bbs/${category}/index.html`)
    let articles = [] as Array<{
        url: string
        date: string
        title: string
        author: string
        assess: string
        category: string
    }>
    let $ = load(html)
    let prev = null
    let next = null
    let isEnd = false
    $('.wide').each((index, el) => {
        let target = $(el)
        if (target.html()?.match('上頁')) {
            let href = target.attr('href')
            if (href) {
                prev = `${baseUrl}${target.attr('href')}`
            }
        }
        if (target.html()?.match('下頁')) {
            let href = target.attr('href')
            if (href) {
                next = `${baseUrl}${href}`
            }
        }
    })
    $('.r-ent, .r-list-sep').each((index, el) => {
        let target = $(el)
        if (target.hasClass('r-list-sep')) {
            isEnd = true
        }
        if (isEnd === false) {
            let $ = load(target.html() ?? '')
            let title = $('.title a').first()
            let url = title.attr('href')
            if (url) {
                let date = $('.date').first().html()?.trim().split('/')
                if (date) {
                    articles.push({
                        url: `${baseUrl}${title.attr('href')}`,
                        date: `${date[0].padStart(2, '0')}-${date[1].padStart(2, '0')}`,
                        title: title.html()?.trim() ?? '',
                        author: $('.author').first().html()?.trim() ?? '',
                        assess: $('.nrec span').first().html() || '',
                        category
                    })
                }
            }
        }
    })
    return {
        prev,
        next,
        articles
    }
}
