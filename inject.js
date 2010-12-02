function replyToMessage(aMessageEvent){
	if (aMessageEvent.name === "action") {
		if(aMessageEvent.message==="getURL") {
			safari.self.tab.dispatchMessage("URL",document.location.href);
		}
	} else if (aMessageEvent.name === "gotoURL") {
		var request = aMessageEvent.message;
		if(request.postdata) {
			document.location='data:text/html;charset=utf-8,%3C%21DOCTYPE%20html%3E%3Chtml%3E%3Chead%3E%3Cscript%3Efunction%20populateForm%28request%29%7Bvar%20form1%3Ddocument.createElement%28%22form%22%29%3Bform1.action%3Drequest.url%3Bform1.id%3D%22form1%22%3Bform1.method%3D%22POST%22%3Bvar%20postdata%20%3D%20request.postdata.split%28%22%26%22%29%3Bfor%28var%20i%3D0%3Bi%3Cpostdata.length%3Bi%2B%2B%29%7Bvar%20item%20%3D%20postdata%5Bi%5D.split%28%22%3D%22%29%3Bvar%20name%20%3D%20item%5B0%5D%3Bvar%20value%20%3D%20item%5B1%5D%3Bvar%20input%20%3D%20document.createElement%28%22input%22%29%3Binput.name%20%3D%20name%3Binput.value%20%3D%20value%3Bform1.appendChild%28input%29%3B%7Ddocument.body.appendChild%28form1%29%3Bdocument.forms%5B0%5D.submit%28%29%3B%7D%3C%2Fscript%3E%3C%2Fhead%3E%3Cbody%20onload%3D%27populateForm%28'+JSON.stringify(request)+'%29%3B%27%3E%3C%2Fbody%3E%3C%2fhtml%3E';
		} else {
			document.location='data:text/html;charset=utf-8,%3C%21DOCTYPE%20html%3E%3Chtml%3E%3Cscript%3Edocument.location%3D%27'+escape(request.url)+'%27%3B%3C%2fscript%3E%3C%2fhtml%3E';
		}
	}
}

safari.self.addEventListener("message", replyToMessage, false);

function serializeForm(form) {
	var retVal = '';
	var els = form.getElementsByTagName('*');
	for( var idx = 0; idx < els.length; idx++) {
		console.log('at element: '+idx);
		var el = els[idx];
		if( !el.disabled && el.name && el.name.length > 0 ) {
			switch(el.tagName.toLowerCase()) {
				case 'input':
					switch( el.type ) {
						case 'checkbox':
						case 'radio':
						if( el.checked ) {
							if( retVal.length > 0 ) {
								retVal += '&';
							}
							retVal += el.name+'='+encodeURIComponent(el.value);
						}
						break;
						case 'hidden':
						case 'password':
						case 'text':
						if( retVal.length > 0 ) {
							retVal += '&';
						}
						retVal += el.name+'='+encodeURIComponent(el.value);
						break;
					}
					break;
				case 'select':
				case 'textarea':
					if( retVal.length > 0 ) {
						retVal += '&';
					}
					retVal += el.name+'='+encodeURIComponent(el.value);
					break;
			}
		}
	}
	return retVal;
}

if(document.forms.length>0) {
	for(var i=0;i<document.forms.length;i++){
		if(document.forms[i].method.toLowerCase() === "post") {
			document.forms[i].addEventListener('submit',function(){safari.self.tab.dispatchMessage("form",serializeForm(this));safari.self.tab.dispatchMessage("form_action",this.action);},false);
		}
	}
}
