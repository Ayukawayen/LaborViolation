'use strict';

const apiUri = 'https://labor-ayukawayen.rhcloud.com/batchGetSheetsValues';
const storageItemName = 'laborViolationCpRecords';
const expireTime = 1800000;

var isRefreshed = false;
var cpRecords = {};

function loadLocalData(ignoreExpire) {
	if(!localStorage) return null;
	
	let data = localStorage.getItem(storageItemName);
	if(!data) return null;
	
	data = JSON.parse(data);
	if(!data) return null;
	
	if(!ignoreExpire && Date.now()>data.expireAt) return null;
	
	return data.value;
}

function refresh(cb) {
	cb = cb||(()=>{});
	
	cpRecords = loadLocalData();
	if(cpRecords) {
		isRefreshed = true;
		cb();
		return;
	}
	
	let xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if(this.readyState !== 4) {
			return;
		}
		if(this.status < 200 || this.status >= 400) {
			cpRecords = loadLocalData(true);
			if(cpRecords) {
				isRefreshed = true;
				cb();
				return;
			}
			
			document.querySelector('#status').textContent = '發生錯誤，請稍後重試。';
			document.querySelector('#status').className = 'error';
			return;
		}
		
		let result = JSON.parse(this.responseText);

		let regex = /^'(.+)'!/;
		
		cpRecords = {};
		result.valueRanges.forEach((valueRange)=>{
			if(!valueRange.values) return;
			
			let 工作表 = regex.exec(valueRange.range)[1];
			
			valueRange.values.forEach((item)=>{
				cpRecords[item[0]] = cpRecords[item[0]] || [];
				cpRecords[item[0]].push({
					工作表:工作表,
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
		cb();
		
		localStorage.setItem(storageItemName, JSON.stringify({
			value:cpRecords,
			expireAt:Date.now()+expireTime,
		}));
	};
	xhr.open('get', apiUri);
	xhr.send('');
}

function getCompanyRecords(name) {
	if(!isRefreshed) return null;
	
	name = name.toLowerCase().replace(/\s+/g, '');
	if(name.length <= 0) return [];
	
	let result = [];
	for(let k in cpRecords) {
		if(k.toLowerCase().replace(/\s+/g, '').indexOf(name) < 0) continue;
		
		result.push({
			name:k,
			records:cpRecords[k],
		});
	}
	
	result.sort((a,b)=>{return a.name>b.name ? 1 : -1});

	return result;
}
