import * as dotenv from 'dotenv';
import * as thecamp from 'the-camp-lib';
import { format, utcToZonedTime } from 'date-fns-tz';

import * as daumNews from './news-parser/daum';
import * as googleNews from './news-parser/google';
import * as newneekNews from './news-parser/newneek';
import * as sbsNews from './news-parser/sbs';

const timeZone = 'Asia/Seoul';

dotenv.config();

const id = process.env.USER_ID || '';
const password = process.env.USER_PWD || '';

const name = process.env.TRAINEE_NAME || '';
const birth = process.env.TRAINEE_BIRTH || '';

const enterDate = process.env.ENTER_DATE || '';
const className = process.env.CLASS_NAME as thecamp.SoldierClassName;
const groupName = process.env.GROUP_NAME as thecamp.SoldierGroupName;
const unitName = process.env.UNIT_NAME as thecamp.SoldierUnitName;
const test = process.env.TEST == 'true';

async function send(title: string, contents: Array<string>) {
	await contents.forEach(async (content, i) => {
		const newTitle = ((title) => {
			if (contents.length != 1)
				return `${title} (${i + 1}/ ${contents.length})`;
			return title;
		})(title);

		if (test) {
			console.log('======================================');
			console.log(
				`name: ${name}
birth: ${birth}
enterDate: ${enterDate}
className: ${className}
groupName: ${groupName}
unitName: ${unitName}`
			);

			console.log();

			console.log('title', newTitle);

			console.log('content', content);
			console.log();

			return;
		}
		const soldier = new thecamp.Soldier(
			name,
			birth,
			enterDate,
			className,
			groupName,
			unitName,
			thecamp.SoldierRelationship.FRIEND
		);

		const cookies = await thecamp.login(id, password);
		await thecamp.addSoldier(cookies, soldier);
		const [trainee] = await thecamp.fetchSoldiers(cookies, soldier);

		const message = new thecamp.Message(
			newTitle,
			content,
			trainee.getTraineeMgrSeq()
		);

		await thecamp.sendMessage(cookies, trainee, message);
	});
}

function getDate() {
	const zonedDate = utcToZonedTime(new Date(), timeZone);
	return format(zonedDate, 'yyyy-MM-dd HH:mm', { timeZone });
}

(async () => {
	//await send(`${getDate()} 다음 뉴스`, await daumNews.getNews());
	await send(`${getDate()} 구글 뉴스`, await googleNews.getNews());
	//await send(`${getDate()} NEWNEEK 뉴스`, await newneekNews.getNews());
	await send(`${getDate()} SBS 뉴스`, await sbsNews.getNews());
})();
