var emoji2 = new function(){
	var self = this;
	this.img_path = 'emoji/';
	this.inits = {};
	this.map = {};
	this.text_mode = false;
	this.replace_colons = function(str){
		self.init_colons();
		return str.replace(self.rx_colons, function(m){
			var idx = m.substr(1, m.length-2);
			var val = self.map.colons[idx];
			return val ? self.replacement(val) : m;
		});
	};
	this.replacement = function(idx){
		var text_name = emoji_data[idx][4] || ':'+emoji_data[idx][3]+':';
		if (self.text_mode) return text_name;
		self.init_env();
		if (self.replace_mode == 'unified') return emoji_data[idx][0];
		if (self.replace_mode == 'softbank') return emoji_data[idx][1];
		if (self.replace_mode == 'google') return emoji_data[idx][2];
		var img = self.img_path+idx+'.png';
		if (self.replace_mode == 'css') return '<span class="emoji" style="background-image:url('+img+')">'+text_name+'</span>';
		return '<img src="'+img+'" class="emoji" />';
	};
	this.init_colons =  function(){
		if (self.inits.colons) return;
		self.inits.colons = 1;
		self.rx_colons = new RegExp('\:[^\\s:]+\:', 'g');
		self.map.colons = {};
		for (var i in emoji_data){
			self.map.colons[emoji_data[i][3]] = i;
		}
	};
	this.init_env = function(){
		if (self.inits.env) return;
		self.inits.env = 1;
		self.replace_mode = 'img';
		var ua = navigator.userAgent;
		if (ua.match(/(iPhone|iPod|iPad|iPhone\s+Simulator)/i)){
			if (ua.match(/OS\s+[12345]/i)) self.replace_mode = 'softbank';
			if (ua.match(/OS\s+[6789]/i)) self.replace_mode = 'unified';
			return;
		}
		if (ua.match(/Mac OS X 10[._ ][789]/i)){
			self.replace_mode = 'unified';
			return;
		}
		if (ua.match(/Android/i)){
			self.replace_mode = 'google';
			return;
		}
		if (window.getComputedStyle){
			var st = window.getComputedStyle(document.body);
			if (st['background-size']){
				self.replace_mode = 'css';
				return;
			}
		}
		// nothing fancy detected - use images
	};
};
