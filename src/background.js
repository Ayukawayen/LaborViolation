'use strict';

const apiKey = configs.apiKey;

const apiUri = 'https://sheets.googleapis.com/v4/spreadsheets';
const ssId = '1uLR9eFePzLzlnkO1k1yh2-2_TJCOYGGEatGCQOgpz9M';

var isRefreshed = false;
var sheetInfos = {};
var cpRecords = {};

refreshSheetInfos(refreshRecords);
setInterval(()=>{
	refreshSheetInfos(refreshRecords);
}, 86400000);


function refreshSheetInfos(callback) {
	callback = callback||(()=>{});
	
	let range = "'索引'!A2:E";
	
	let uri = `${apiUri}/${ssId}/values/${range}?key=${apiKey}`;
	
	let xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if(this.readyState !== 4) {
			return;
		}
		if(this.status !== 200) {
			return;
		}
		
		let result = JSON.parse(this.responseText);
		sheetInfos = {};
		result.values.forEach((item) => {
			sheetInfos[item[0]] = {
				desc:item[1]||'',
				authority:item[2]||'',
				lastModified:new Date(item[3]||0),
				lastCheck:new Date(item[4]||0),
			}
		});
		
		callback();
	};
	xhr.open('get', uri);
	xhr.send('');
};

function refreshRecords(callback) {
	callback = callback||(()=>{});

	let uri = `${apiUri}/${ssId}/values:batchGet?key=${apiKey}`;
	for(let k in sheetInfos) {
		uri += `&ranges='${k}'!A2:E`
	}
	
	let xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if(this.readyState !== 4) {
			return;
		}
		if(this.status !== 200) {
			return;
		}
		
		let result = JSON.parse(this.responseText);

		let regex = /^'(.+)'!/;
		
		cpRecords = {};
		
		result.valueRanges.forEach((valueRange)=>{
			let name = regex.exec(valueRange.range)[1];

			valueRange.values.forEach((item)=>{
				cpRecords[item[0]] = cpRecords[item[0]] || [];
				cpRecords[item[0]].push({
					資料集:name,
					主管:sheetInfos[name].authority,
					條款:item[1],
					內容:item[2],
					文號:item[3],
					日期:item[4],
				});
			});
		});
		
		for(let cpName in cpRecords) {
			cpRecords[cpName].sort((a,b) => ((a.日期==b.日期) ? (a.條款>b.條款 ? 1 : -1) : (a.日期>b.日期 ? -1 : 1)));
		}
		
		isRefreshed = true;
		
		callback();
	};
	xhr.open('get', uri);
	xhr.send('');
};



chrome.runtime.onMessage.addListener(
	(request, sender, sendResponse) => {
		if(request.getCompanyRecords) {
			if(!isRefreshed) {
				sendResponse(null);
				return;
			}
			sendResponse(getCompanyRecords(request.getCompanyRecords));
		}
	}
);

function getCompanyRecords(args) {
	let result = {};
	args.companyNames.forEach((cpName)=>{
		result[cpName] = {};
		
		for(let k in cpRecords) {
			if(!isCompanyNameMatch(k, cpName)) continue;
			
			result[cpName][k] = cpRecords[k];
		}
	});
	return result;
};

function isCompanyNameMatch(a, b) {
	a = a.replace(/\s+/g, '');
	b = b.replace(/\s+/g, '');
	
	if(a.length <= 0 || b.length <= 0) return false;
	
	let aNeedle = a.split('公司')[0] || a;
	let bNeedle = b.split('公司')[0] || b;
	
	if(a.indexOf(bNeedle) >= 0) return true;
	if(b.indexOf(aNeedle) >= 0) return true;
	
	return false;
};