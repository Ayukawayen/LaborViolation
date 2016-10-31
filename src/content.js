'use strict';

let siteWrapper = new SiteWrapper();
let nodes;

refreshCompanyNodes();
if(siteWrapper.refreshInterval > 0) {
	setInterval(refreshCompanyNodes, siteWrapper.refreshInterval);
}


function refreshCompanyNodes() {
	nodes = siteWrapper.listNodes();

	let cpNames = nodes
		.map((item) => item.cpName)
		.filter((item,i,a) => i==a.indexOf(item))
	;
//console.log(cpNames);

	if(cpNames.length <= 0) return;

	chrome.runtime.sendMessage(
		{getCompanyRecords:{
			companyNames:cpNames,
		}},
		(result)=>{
//console.log(result);
			if(result === null) {
				setTimeout(refreshCompanyNodes, 1000);
				return;
			}
			
			nodes.forEach((node)=>{
				if(node.querySelector('.netAyukawayenLabor_icon')) return;
				
				let cpRecord = result[node.cpName];
				
				let count = 0;
				let title = '';
				
				for(let k in cpRecord) {
					count += cpRecord[k].length;
					title += k+'\n' + cpRecord[k].reduce((result, item) => (result + '  '+item.條款+'：'+item.內容+' ('+item.日期+')\n'), '');
				}
				
				let iconNode = Dom.createElement('span', {
					'class':`netAyukawayenLabor_icon v_${count}`,
					'title': title||'未發現違反勞基法記錄',
				}, count);
				
				node.appendChild(iconNode);
				
				iconNode.cpRecord = cpRecord;
				iconNode.cntRecord = count;
				iconNode.addEventListener('click', onIconNodeClick);
			});
		}
	);
};

function onIconNodeClick(ev) {
	ev.preventDefault();

	if(ev.target.cntRecord <= 0) return;
	
	putDetailNode(ev.target.cpRecord);
};

function putDetailNode(cpRecord) {
	let node = getDetailNode();
	
	let listNode = node.querySelector('dl');
	while(listNode.lastChild) {
		listNode.removeChild(listNode.lastChild);
	}
	
	for(let k in cpRecord) {
		let records = cpRecord[k];
		listNode.appendChild(Dom.createElement('dt', {}, k));
		records.forEach((item)=>{
			listNode.appendChild(Dom.createElement('dd', {}, [
				Dom.createElement('span', {'class':'條款'}, item.條款),
				Dom.createElement('span', {'class':'內容'}, item.內容),
				Dom.createElement('span', {'class':'資料集'}, item.資料集),
				Dom.createElement('span', {'class':'文號'}, item.文號),
				Dom.createElement('span', {'class':'日期'}, item.日期),
			]));
		});
	};

	node.classList.add('opened');
};
function getDetailNode() {
	let node = document.querySelector('#netAyukawayenLabor');
	if(node) return node;
	
	node = Dom.createElement('div', {'id':'netAyukawayenLabor'}, [
		Dom.createElement('span', {'class':'netAyukawayenLabor_close'}, '×'),
		Dom.createElement('dl'),
	]);
	
	node.querySelector('.netAyukawayenLabor_close').addEventListener('click', (ev)=>{
		document.querySelector('#netAyukawayenLabor').classList.remove('opened');
	});
	
	let zIndex = 1;
	let nodes = document.querySelectorAll('*');
	for(let i=0;i<nodes.length;++i) {
		let z = parseInt(window.getComputedStyle(nodes[i]).getPropertyValue('z-index')) || 0;
		if(zIndex < z) {
			zIndex = z+1;
		}
	};
	node.style.zIndex = zIndex;
	
	document.body.appendChild(node);
	
	return node;
};
