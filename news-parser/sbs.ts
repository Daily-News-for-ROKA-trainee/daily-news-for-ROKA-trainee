import * as rssParser from 'rss-parser';

export async function getNews() {
	try {
		const parser = new rssParser({
			headers: {
				Accept:
					'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
			},
		});

		const xml = 'http://news.sbs.co.kr/news/ReplayRssFeed.do';
		const feed = await parser.parseURL(xml);

		const message_items = feed.items!.map((item) => {
			const { title, content } = item;
			return `# ${title}<br>${content}`;
		});
		const sliced_message_items = message_items.slice(
			0,
			message_items.indexOf('# 클로징\n8뉴스 마칩니다. 고맙습니다.')
		);

		return [
			sliced_message_items.join('<br><br>').slice(0, 1500),
			sliced_message_items.join('<br><br>').slice(1500, 3000),
		];
	} catch (e) {
		return [
			`SBS 뉴스 파싱에 실패하였습니다. 코드와 stackTrace라도 보내드립니다.\n${e.stack}`,
		];
	}
}
