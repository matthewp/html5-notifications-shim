/*
 * HTML5 Notifications Shim
 * Bringing backwards compatibility to HTML5 notifications
 *
 * Forked from Gritter for JQuery
 * http://www.boedesign.com Credit the original author.
 * Copyright (c) 2011 Jordan Boesch
 * Dual licensed under the MIT and GPL licenses.
 *
 * Date: July 5, 2011
 * Version: 0.1
 */

(function(){
	var noti, noticenter;

	createCookie = function(name,value,days) {
		if (days) {
			var date = new Date();
			date.setTime(date.getTime()+(days*24*60*60*1000));
			var expires = "; expires="+date.toGMTString();
		}
		else var expires = "";
		document.cookie = name+"="+value+expires+"; path=/";
	}

	readCookie = function(name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length;i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
		}
		return null;
	}

	eraseCookie = function(name) {
		createCookie(name,"",-1);
	}

	uuid = function() {
	   var chars = '0123456789abcdef'.split('');

	   var uuid = [], rnd = Math.random, r;
	   uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
	   uuid[14] = '4'; // version 4

	   for (var i = 0; i < 36; i++)
	   {
	      if (!uuid[i])
	      {
		 r = 0 | rnd()*16;

		 uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r & 0xf];
	      }
	   }

	   return uuid.join('');
	}
	
	/* Begin my code. */
	/* Begin Notification interface */
	noti = function(params) {
		var c, elem;
		c = document.createElement('div');

		if(params.type === "html") {
			/* TODO grab the url */
		} else {
			/* TODO create the notification */
			var icon, pic, title, body, content;
			icon = document.createElement('div');
			icon.style.float = "left";
			icon.style.width = "19%";
			pic = new Image();
			pic.src = params.icon;
			icon.appendChild(pic);

			title = document.createElement('div');
			title.style.fontWeight = "bold";
			title.innerText = params.title;

			body = document.createElement('div');
			body.innerText = params.body;

			content = document.createElement('div');
			content.style.float = "left";
			content.style.width = "80%";
			content.appendChild(title);
			content.appendChild(body);
		
			c.appendChild(icon);	
			c.appendChild(content);
		}

		elem = document.createElement('div');
		elem.id = uuid();
		elem.style.border = "1px solid black";
		elem.style.position = "fixed";
		elem.style.padding = "5px";
		elem.style.margin = "5px";
		elem.style.width = "250px";
		elem.style.right = "0";
		elem.appendChild(c);

		this._elem = elem;

		return this;
	}

	noti.prototype.show = function() {
		/* TODO show a notification */
		var animate, h, self;
		self = this;
		
		document.body.appendChild(self._elem);
		animate = function() {
			var elem, b;
			elem = document.getElementById(self._elem.id);
			b = parseInt(elem.style.bottom.split("px")[0]);
			if(b < 0) {
				b += 5;
				elem.style.bottom = b + "px";
				setTimeout(animate, 10);
			}
		}

		h = self._elem.offsetHeight;
		self._elem.style.bottom = "-" + h + "px";

		setTimeout(animate, 50);
	}

	noti.prototype.cancel = function() {
		/* TODO cancel a notification */
	}

	/* TODO event listeners for ondisplay, onerror, onclose */
	/* End Notification interface */

	/* Begin NotificationCenter interface */
	noticenter = {};
	noticenter.PERMISSION_ALLOWED = 0;
	noticenter.PERMISSION_NOT_ALLOWED = 1;
	noticenter.PERMISSION_DENIED = 2;
	noticenter.checkPermission = function() {
		_code = readCookie("noti");
		if(_code == null) {
			_code = 1;
		}
		return _code;
	}

	noticenter.requestPermission = function(callback) {
		var elem, msg, allow, deny, close, width, save;

		save = function(code) {
			_code = code;
			createCookie("noti", code, 120);
		}

		msg = document.createElement('span');
		var where = document.domain.length > 0 ? document.domain : document.URL;
		msg.innerHTML = "Allow " + where + " to show notifications?";
		msg.style.float = "left";
		msg.style.margin = "5px";
		msg.style.padding = "5px";

		allow = document.createElement('div');
		allow.innerHTML = "<span>Allow</span>";
		allow.style.background = "#F3F3EE";
		allow.style.float = "right";
		allow.style.border = "1px solid black";
		allow.style.margin = "5px";
		allow.style.padding = "5px";
		allow.style.width = "50px";
		allow.style.cursor = "pointer";
		allow.style.textAlign = "center";
		allow.onclick = function() {
			save(noticenter.PERMISSION_ALLOWED);
			document.body.removeChild(elem);
			if(callback) {
				callback();
			}
		}

		deny = document.createElement('div');
		deny.innerHTML = "<span>Deny</span>";
		deny.style.background = "#F3F3EE";
		deny.style.float = "right";
		deny.style.border = "1px solid black";
		deny.style.margin = "5px";
		deny.style.padding = "5px";
		deny.style.width = "50px";
		deny.style.cursor = "pointer";
		deny.style.textAlign = "center";
		deny.onclick = function() {
			save(noticenter.PERMISSION_DENIED);
			document.body.removeChild(elem);
			if(callback) {
				callback();
			}
		}
		

		close = document.createElement('div');
		close.innerHTML = "<span>x</span>";
		close.style.float = "right";
		close.style.margin = "5px";
		close.style.padding = "5px";
		close.style.width = "10px";
		close.style.cursor = "pointer";
		close.style.textAlign = "center";

		close.onclick = function() {
			document.body.removeChild(elem);
			if(callback) {
				callback();
			}
		}

		clear = document.createElement('div');
		clear.style.clear = "both";

		elem = document.createElement('div');
		
		if(typeof(window.innerWidth) == 'number') {
			width = window.innerWidth;
		} else if(document.documentElement && document.documentElement.clientWidth) {
			width = document.documentElement.clientWidth;
		} else if(document.body && document.body.clientWidth) {
			width = document.body.clientWidth;
		}

		elem.style.width = width;
		elem.style.background = "#FDEDA6";
		elem.style.position = "absolute";
		elem.style.left = "0";
		elem.style.top = "0";
		elem.appendChild(msg);
		elem.appendChild(close);
		elem.appendChild(deny);
		elem.appendChild(allow);
		elem.appendChild(clear);

		document.body.insertBefore(elem, document.body.childNodes[0]);
	}

	noticenter.createNotification = function(icon, title, body) {
		/* TODO create the notification with Gritter */
		if(true) { /* TODO check to see if we have the proper permissions */
			var p;
			p = {
				"type": "text",
				"icon": icon,
				"title": title,
				"body": body
			};
			return new noti(p);
		} else {
			return null;
		}
	}

	noticenter.createHTMLNotification = function(url) {
		/* TODO grab the URL and show notification from it */
	}
	/* End NotificationCenter interface */

	window.notifications = noticenter;

	/* End my code. */
	
}).call(this);
