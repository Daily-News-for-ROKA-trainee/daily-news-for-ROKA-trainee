import * as rssParser from 'rss-parser'

export async function getNews() {
	try {
		const parser = new rssParser()

		const xml = 'https://news.google.com/rss?gl=KR&hl=ko&ceid=KR:ko'
		const feed = await parser.parseURL(xml)

		let message = ''
		feed.items!.forEach((item) => {
			const { title } = item
			if (title && item.title.length > 20) {
				message = `${message}<br># ${title}`
			}
		})

		return [message]
	} catch (e) {
		return [
			`구글 뉴스 파싱에 실패하였습니다. 코드와 stackTrace라도 보내드립니다.\n${e.stack}`
		]
	}
}
