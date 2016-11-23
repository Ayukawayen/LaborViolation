'use strict';

var SiteWrapper = function(args){
	this.listNodes = (()=>[]);
	this.refreshInterval = 0;
	
	for(let i=0;i<SiteWrapper.wrappers.length;++i) {
		let wrapper = SiteWrapper.wrappers[i];
		if(wrapper.test()) {
			this.listNodes = ()=>(wrapper.listNodes()
				.filter((node)=>(!node.querySelector('.netAyukawayenLabor_icon')))
				.filter((node)=>(!(/^\s*$/.test(node.cpName))))
			);
			this.refreshInterval = wrapper.getRefreshInterval ? wrapper.getRefreshInterval() : this.refreshInterval;
			
			break;
		}
	}
};

SiteWrapper.wrappers = [
	{
		test:()=>(location.host.indexOf('m.104.com.tw')>=0),
		
		listNodes:()=>{
			let nodes = [];
			
			nodes = nodes.concat(Array.prototype.filter.call(document.querySelectorAll('a'), (node)=>{
				if(node.href.toLowerCase().indexOf('http') != 0) return false;
				if(node.textContent == '看更多公司資訊') return false;
				if(node.href.toLowerCase().indexOf('/cust/') >= 0) return true;
				
				return false;
			}));
			
			nodes = nodes.concat(Array.prototype.filter.call(document.querySelectorAll('.company'), (node)=>{
				return true;
			}));
			
			nodes = nodes.concat(Array.prototype.filter.call(document.querySelectorAll('.cust'), (node)=>{
				return true;
			}));
			
			nodes.forEach((node)=>{
				node.cpName = node.textContent;
			})
			
			return nodes;
		},
	},
	
	{
		test:()=>(location.host.indexOf('104.com.tw')>=0),
		
		listNodes:()=>{
			let nodes = Array.prototype.filter.call(document.querySelectorAll('a'), (node)=>{
				if(node.href.toLowerCase().indexOf('http') != 0) return false;
				if(node.textContent == '找公司') return false;
				if(node.href.toLowerCase().indexOf('#') >= 0) return false;
				if(node.href.toLowerCase().indexOf('/jobbank/custjob/index.php?') >= 0) return true;
				if(node.href.toLowerCase().indexOf('/cust_job/introduce.cfm?') >= 0) return true;
				
				return false;
			});
			
			nodes.forEach((node)=>{
				node.cpName = node.textContent;
			});
			
			return nodes;
		},
		
		getRefreshInterval:()=>(location.href.toLowerCase().indexOf('104.com.tw/jobbank/joblist/joblist.cfm')>=0 ? 500 : 0),
	},
	
	{
		test:()=>(false
			|| (location.href.toLowerCase().indexOf('1111.com.tw/mobileweb/job-index.asp')>=0)
			|| (location.href.toLowerCase().indexOf('1111.com.tw/mobileweb/job-list.asp')>=0)
		),
		
		listNodes:()=>{
			let nodes = Array.prototype.filter.call(document.querySelectorAll('a'), (node)=>{
				if(node.href.toLowerCase().indexOf('http') != 0) return false;
				if(node.href.toLowerCase().indexOf('#') >= 0) return false;
				if(node.href.toLowerCase().indexOf('/job-description.asp?') >= 0) return true;
				if(node.href.toLowerCase().indexOf('/company-description.asp?') >= 0) return true;
				
				return false;
			}).map((node)=>{
				if(node.href.toLowerCase().indexOf('/job-description.asp?') >= 0) {
					return node.querySelector('.list_content >p:nth-of-type(2)')||node;
				}
				if(node.href.toLowerCase().indexOf('/company-description.asp?') >= 0) {
					return node.querySelector('.list_content >p:nth-of-type(1)')||node;
				}
				return node;
			});
			
			nodes.forEach((node)=>{
				node.cpName = node.textContent.replace('【股】','股份有限公司');
			});
			
			return nodes;
		},
		
		getRefreshInterval:()=>(location.href.toLowerCase().indexOf('1111.com.tw/mobileweb/job-list.asp')>=0 ? 500 : 0),
	},
	{
		test:()=>(false
			|| (location.href.toLowerCase().indexOf('1111.com.tw/mobileweb/company-description.asp')>=0)
		),
		
		listNodes:()=>{
			let nodes = Array.prototype.filter.call(document.querySelectorAll('.corpTitle'), (node)=>{
				return true;
			});
			
			nodes.forEach((node)=>{
				node.cpName = node.textContent.replace('【股】','股份有限公司');
			});
			
			return nodes;
		},
	},

	{
		test:()=>(location.host.indexOf('1111.com.tw')>=0),
		
		listNodes:()=>{
			let nodes = Array.prototype.filter.call(document.querySelectorAll('a'), (node)=>{
				if(node.href.toLowerCase().indexOf('http') != 0) return false;
				if(node.href.toLowerCase().indexOf('#') >= 0) return false;
				if(node.textContent.indexOf('公司基本資料') >= 0) return false;
				if(node.href.toLowerCase().indexOf('sec=emplist') >= 0) return false;
				if(node.href.toLowerCase().indexOf('/company-description.asp?') >= 0) return true;
				
				return false;
			}).map((node)=>{
				return node.lastElementChild || node;
			});
			
			nodes.forEach((node)=>{
				node.cpName = node.textContent.replace('【股】','股份有限公司');
			});
			
			return nodes;
		},
	},

	{
		test:()=>(location.host.indexOf('m.518.com.tw')>=0),
		
		listNodes:()=>{
			let nodes = [];
			nodes = nodes.concat(Array.prototype.filter.call(document.querySelectorAll('a'), (node)=>{
				if(!(/^(http|\/)/.test(node.href.toLowerCase()))) return false;
				if(node.textContent.indexOf('所有工作機會') >= 0) return false;
				if(node.textContent.indexOf('查看更多公司資料') >= 0) return false;
				if(node.textContent.indexOf('回頂端') >= 0) return false;
				if(node.href.toLowerCase().indexOf('/job-comp_detail') >= 0) return true;
				
				return false;
			}));
			
			nodes = nodes.concat(Array.prototype.filter.call(document.querySelectorAll('.job-comp-name'), (node)=>{
				return true;
			}));
			
			nodes = nodes.concat(Array.prototype.filter.call(document.querySelectorAll('.job_detail >span'), (node)=>{
				return true;
			}));
			
			nodes.forEach((node)=>{
				node.cpName = node.textContent;
			});
			
			return nodes;
		},
		
		getRefreshInterval:()=>(location.href.toLowerCase().indexOf('518.com.tw/job-index')>=0 ? 1000 : 0),
	},
	
	{
		test:()=>(location.host.indexOf('518.com.tw')>=0),
		
		listNodes:()=>{
			let nodes = Array.prototype.filter.call(document.querySelectorAll('a'), (node)=>{
				if(node.href.toLowerCase().indexOf('http') != 0) return false;
				if(node.textContent.indexOf('518徵才') >= 0) return false;
				if(node.href.toLowerCase().indexOf('#') >= 0) return false;
				if(node.href.toLowerCase().indexOf('-company-') >= 0) return true;
				
				return false;
			});
			
			nodes.forEach((node)=>{
				node.cpName = node.textContent;
			});

			return nodes;
		},
	},
	
	{
		test:()=>(false
			|| (location.href.toLowerCase().indexOf('m.yes123.com.tw/memmvc/')>=0)
		),
		
		listNodes:()=>{
			let nodes = [];
			
			nodes = nodes.concat(Array.prototype.filter.call(document.querySelectorAll('.job_list li dt:nth-of-type(1)'), (node)=>{
				return true;
			}));
			
			nodes = nodes.concat(Array.prototype.filter.call(document.querySelectorAll('.bis_name_20'), (node)=>{
				return true;
			}));
			
			nodes.forEach((node)=>{
				node.cpName = node.textContent;
			});
			
			return nodes;
		},
		
		getRefreshInterval:()=>500,
	},
	{
		test:()=>(false
			|| (location.href.toLowerCase().indexOf('m.yes123.com.tw/member/')>=0)
		),
		
		listNodes:()=>{
			let nodes = [];
			
			nodes = nodes.concat(Array.prototype.filter.call(document.querySelectorAll('#item_co_name'), (node)=>{
				return true;
			}));
			
			nodes = nodes.concat(Array.prototype.filter.call(document.querySelectorAll('.list_content .company'), (node)=>{
				return true;
			}));
			
			nodes.forEach((node)=>{
				node.cpName = node.textContent;
			});
			
			return nodes;
		},
		
		getRefreshInterval:()=>500,
	},

	{
		test:()=>(location.host.indexOf('yes123.com.tw')>=0),
		
		listNodes:()=>{
			let nodes = Array.prototype.filter.call(document.querySelectorAll('a'), (node)=>{
				if(node.href.toLowerCase().indexOf('http') != 0) return false;
				if(node.textContent.indexOf('回公司介紹') >= 0) return false;
				if(node.textContent.indexOf('請登入會員') >= 0) return false;
				if(node.href.toLowerCase().indexOf('/job_refer_comp_info.asp?') >= 0) return true;
				
				return false;
			});
			
			nodes.forEach((node)=>{
				node.cpName = node.textContent;
			});
			
			return nodes;
		},
	},

	
];
