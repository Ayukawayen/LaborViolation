var adNode = document.querySelector("#ad");

var adData = null;

if( adNode.clientHeight==50) {
	adData = {
		"insStyle":"display:inline-block;width:320px;height:50px",
		"slot":"3033538561",
	};
}
else if( adNode.clientHeight==240) {
	adData = {
		"insStyle":"display:inline-block;width:120px;height:240px",
		"slot":"8800870560",
	};
}
else {
	adData = {
		"insStyle":"display:block",
		"slot":"3011688963",
	};
}

if(adData != null) {
	adNode.innerHTML = ''
		+ '<ins class="adsbygoogle"' + "\r\n"
		+ '     style="'+adData.insStyle+'"' + "\r\n"
		+ '     data-ad-client="ca-pub-4630507029063248"' + "\r\n"
		+ '     data-ad-slot="'+adData.slot+'"></ins>' + "\r\n"
	;

	(adsbygoogle = window.adsbygoogle || []).push({});
}
