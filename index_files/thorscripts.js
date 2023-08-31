/* Use old cfinput validation messages after migrating to input tags */
$('[message]').each(function(i, el) {
	var validationMessage = el.attributes['message'].value;
	el.oninvalid = (e) => e.target.setCustomValidity(validationMessage)
	el.oninput = (e) => e.target.setCustomValidity('')
})

function clearText(thefield){
	if (thefield.defaultValue==thefield.value)
	thefield.value = ""
} 

//anylinkmenu.init("menu_anchors_class") //Pass in the CSS class of anchor links (that contain a sub menu)
anylinkmenu.init("menuanchorclass");

var csshoverReg = /(^|\s)(([^a]([^ ]+)?)|(a([^#.][^ ]+)+)):(hover|active)/i,
currentSheet, doc = window.document, hoverEvents = [], activators = {
	onhover:{on:'onmouseover', off:'onmouseout'},
	onactive:{on:'onmousedown', off:'onmouseup'}
}

function parseStylesheets() {
	if(!/MSIE (5|6)/.test(navigator.userAgent)) return;
	window.attachEvent('onunload', unhookHoverEvents);
	var sheets = doc.styleSheets, l = sheets.length;
	for(var i=0; i<l; i++) 
		parseStylesheet(sheets[i]);
}

function parseStylesheet(sheet) {
	if(sheet.imports) {
		try {
			var imports = sheet.imports, l = imports.length;
			for(var i=0; i<l; i++) parseStylesheet(sheet.imports[i]);
		} catch(securityException){}
	}

	try {
		var rules = (currentSheet = sheet).rules, l = rules.length;
		for(var j=0; j<l; j++) parseCSSRule(rules[j]);
	} catch(securityException){}
}

function parseCSSRule(rule) {
	var select = rule.selectorText, style = rule.style.cssText;
	if(!csshoverReg.test(select) || !style) return;
	
	var pseudo = select.replace(/[^:]+:([a-z-]+).*/i, 'on$1');
	var newSelect = select.replace(/(\.([a-z0-9_-]+):[a-z]+)|(:[a-z]+)/gi, '.$2' + pseudo);
	var className = (/\.([a-z0-9_-]*on(hover|active))/i).exec(newSelect)[1];
	var affected = select.replace(/:(hover|active).*$/, '');
	var elements = getElementsBySelect(affected);
	if(elements.length == 0) return;

	currentSheet.addRule(newSelect, style);
	for(var i=0; i<elements.length; i++)
		new HoverElement(elements[i], className, activators[pseudo]);
}

function HoverElement(node, className, events) {
	if(!node.hovers) node.hovers = {};
	if(node.hovers[className]) return;
	node.hovers[className] = true;
	hookHoverEvent(node, events.on, function() { node.className += ' ' + className; });
	hookHoverEvent(node, events.off, function() { node.className = node.className.replace(new RegExp('\\s+'+className, 'g'),''); });
}
function hookHoverEvent(node, type, handler) {
	node.attachEvent(type, handler);
	hoverEvents[hoverEvents.length] = { 
		node:node, type:type, handler:handler 
	};
}

function unhookHoverEvents() {
	for(var e,i=0; i<hoverEvents.length; i++) {
		e = hoverEvents[i]; 
		e.node.detachEvent(e.type, e.handler);
	}
}

function getElementsBySelect(rule) {
	var parts, nodes = [doc];
	parts = rule.split(' ');
	for(var i=0; i<parts.length; i++) {
		nodes = getSelectedNodes(parts[i], nodes);
	}	return nodes;
}
function getSelectedNodes(select, elements) {
	var result, node, nodes = [];
	var identify = (/\#([a-z0-9_-]+)/i).exec(select);
	if(identify) return [doc.getElementById(identify[1])];
	
	var classname = (/\.([a-z0-9_-]+)/i).exec(select);
	var tagName = select.replace(/(\.|\#|\:)[a-z0-9_-]+/i, '');
	var classReg = classname? new RegExp('\\b' + classname[1] + '\\b'):false;
	for(var i=0; i<elements.length; i++) {
		result = tagName? elements[i].all.tags(tagName):elements[i].all; 
		for(var j=0; j<result.length; j++) {
			node = result[j];
			if(classReg && !classReg.test(node.className)) continue;
			nodes[nodes.length] = node;
		}
	}	return nodes;
}

// Pop Up Div layer code
function openLayer(x) {
	if (document.getElementById(x)!= null){
		document.getElementById(x).style.display='block';}
	}

function closeLayer(x) {
	if (document.getElementById(x)!= null){
		document.getElementById(x).style.display='none';}
	}

function goToURL() {
  var i, args=goToURL.arguments; document.returnValue = false;
  for (i=0; i<(args.length-1); i+=2) eval(args[i]+".location='"+args[i+1]+"'");
}

function taLimit() {
	var taObj=event.srcElement;
	if (taObj.value.length==taObj.maxLength*1) return false;
}

function taCount(visCnt) { 
	var taObj=event.srcElement;
	if (taObj.value.length>taObj.maxLength*1) taObj.value=taObj.value.substring(0,taObj.maxLength*1);
	if (visCnt) visCnt.innerText=taObj.maxLength-taObj.value.length;
}

function reloadCaptchaImage()
{
	vCaptchaImg = new Image();
	vCaptchaImg.src = "/captcha/image.cfm?" + Date.parse(new Date().toString());
	
	for (i=0;i < document.images.length;i++)
	{
	  if (document.images[i].name.search(/captchaImg/) > -1)
		{
			document.images[i].src = vCaptchaImg.src;
		}
	}
}
function catchEmptyForm(form,ele)
{
  if (document.forms[form][ele].value == "") 
	{
		return false;
	}
	else 
	{
		return true;
	}
}

/* Cart Functions */
$('#myBasket').change(function() {
	if ($(this).find('input[id^="lineid"]:checked').length) {
		$('#RemoveSelectedbtn').removeAttr('disabled');
	} else {
		$('#RemoveSelectedbtn').attr('disabled', 'disabled');
	}
});