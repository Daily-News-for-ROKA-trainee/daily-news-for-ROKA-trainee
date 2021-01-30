import * as requestPromise from 'request-promise';
import * as cheerio from 'cheerio';

export async function getNews() {
	try {
		const options = (url: string) => {
			return {
				url,
				method: 'GET',
			};
		};

		const contentUrl = async () => {
			const listResponse = await requestPromise(
				options('https://newneek.co/library')
			);
			const $ = cheerio.load(listResponse);
			return $(
				'.col-dz.col-dz-.col-xdz.col-xdz-12 ._widget_data > .widget._text_wrap.widget_text_wrap.fr-view > div:nth-child(2) > div:nth-child(1) > p:nth-child(3) > span:nth-child(1) > a:nth-child(1)'
			)[0].attribs.href;
		};

		const contentResponse = await requestPromise(options(await contentUrl()));
		const $ = cheerio.load(contentResponse, { decodeEntities: false });

		const title = $('.view_tit').text();
		$('.stb-block.share.noBorder').remove();
		return [$('.inner').html()];
	} catch (e) {
		return [
			`NEWNEEK 뉴스 파싱에 실패하였습니다. 코드와 stackTrace라도 보내드립니다.\n${e.stack}`,
		];
	}
}
