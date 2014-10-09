var htmlID = '3';
var cssID = '2';
var guest = 'no'; // yes or no
var tag = ['<script>', '<html>', '<iframe>', '<body>', '<head>'];
var cssDefault = 'body{background-color:#F1F1F1;font-family:\'lucida grande\',tahoma,verdana,arial,sans-serif}#tabs li a,.main-head,#pun-intro{background-color:#312A1E!important;border:0!important}#tabs li a,.main-head,#pun-intro,#profile-advanced-add a{font:15px/20px\'Open Sans Condensed\',sans-serif;color:#F0F0F0!important;text-align:center;font-weight:bold!important}.main-content{padding:4px !important;background-color: #FBFBFB !important;border: 1px solid #DDDDDD !important;}#pun-intro a,#pun-head a{color:#F0F0F0!important;text-decoration:none}#profile-advanced-details textarea{resize:none;height:90px}#tabs li a{padding:10px!important;margin-left:-4px;background:url("http://2.bp.blogspot.com/-IfiIwt0iR5c/UL4zzUjtGyI/AAAAAAAABho/rlYYH1q2iCY/s1600/sec-sep.gif")no-repeat scroll left top transparent}#tabs{top:-32px}.pun{background-color:#FAFAFA;width:auto;padding:30px}#pun-intro{padding:5px;display:inline;border-bottom-right-radius:4px;left:0px;position:absolute;top:0px}#pun-head{background-color:#227264;margin:45px 0;padding:10px}#profile-advanced-details{margin-top:80px}#profile-advanced-right{margin-top:100px}#a:link,#profile-advanced-right.module.main a:link{color:#626262!important;text-decoration:none;transition:color 0.2s ease-in-out 0s}#profile-advanced-details a:hover,#profile-advanced-right.module.main a:hover{color:#8F8F8F!important}.field_uneditable{border:1px solid#DDDDDD;max-height:60px;overflow:auto;padding:5px}#copyright a{color:#000;text-decoration:none}#profile-advanced-add a{display:block;margin:auto;max-width:60%;padding:5px;text-decoration:none}#profile-advanced-add a:first-child{background-color:#459766;margin-bottom:5px}#profile-advanced-add a:last-child{background-color:#FF5959}#profile-loading{font-size:16px;font-weight:bold;margin:auto auto 5px;padding:10px;text-align:center;width:80px}#wall-reply{margin-bottom:10px}#wall-reply div input[name="subject"]{float:right;width:350px}#wall-reply div input[name="preview"],#wall-reply div input[name="post"]{background-color:#F4F4F4;border:1px solid#DDDDDD;cursor:pointer;margin-left:6px}#wall-reply div input[name="subject"]{float:right;width:350px}#wall-reply div input[name="preview"]:hover,#wall-reply div input[name="post"]:hover{box-shadow:inset 1px 1px 0 0 rgba(0,0,0,0.25)}#outter-wall{position:relative;margin-bottom:8px}#wall-preview{position:absolute;height:100%;width:100%;background-color:#F4F4F4;border:1px#ddd solid}';
/////// KHÔNG CH?NH S?A M?I TH? DÝ?I D?NG NÀY ///////
$(function () {
	var x = document.getElementById('unl');
	uid = x.childNodes[0].href.substring(x.childNodes[0].href.indexOf('&u=') + 3);
	uname = x.childNodes[0].innerHTML;
	if (document.getElementById('tabs')) {
		if (guest == 'yes' && uid == '-1') {
			document.getElementsByTagName('head')[0].insertAdjacentHTML('afterend', '<style type="text/css">body{display:none}</style>');
			alert('Please login to use this feature');
			location.href = 'http://' + location.host
		}
		if (uid != '-1') {
			$('#profile-advanced-right .module.main').has('noscript').remove();
			$('#main-content div').first().remove();
		}
		if (uname != $('#profile-advanced-right .h3 span').first().text()) {
			$('#field_id' + htmlID + ', #field_id' + cssID).hide().next().hide();
		}
		document.getElementById('profile-advanced-layout').insertAdjacentHTML('beforeend', '<div id="copyright"><b><a href="www.fmvi.vn/t880-">zProfile</a> © 2013 by <a href="mailto:mark.polo.nguyen@gmail.com">Zero</a>. All rights reserved</b></div>');
		$('#pun-head > *, #pun-intro > *, #pun-foot, #pun-visit').remove();
		$('#profile-advanced-add br').remove();
		$('#profile-advanced-details .main-head').first().remove();
		$('#pun-intro').html('<a href="http://' + location.host + '/forum">Back to forum</a>');
		$('#profile-advanced-details textarea').attr({
			'cols': '95',
			'rows': '4'
		});
	}
	setInterval("$(function () {$('#field_id'+cssID+' img.ajax-profil_valid').attr('onclick','zprofile.css()');$('#field_id'+htmlID+' img.ajax-profil_valid').attr('onclick','zprofile.html()')});", 1000);
	$('head').append('<style>' + $("#field_id" + cssID + " .field_uneditable").text() + '</style>');
	$('#profile_field_2_' + cssID).after('<a style="cursor:pointer" onclick="zprofile.back()">Default</a>');
	$('#pun-head').append($('#field_id' + htmlID + ' .field_uneditable').text().replace('{USERNAME}', uname).replace('{USERID}', uid));
	$('#profile-advanced-add a').click(function (a) {
		$.get(this.href);
		a.preventDefault();
		$('#profile-advanced-add').hide();
		alert('Added')
	});
	zprofile.start();
});
$('#text_editor_textarea').keyup(function () {
	var y = document.getElementById('profile_field_2_' + htmlID).value;
	for (var i in tag) {
		regex = new RegExp(tag[i], 'i');
		if (regex.test(y)) {
			alert('No script allowed');
			document.getElementById('profile_field_2_' + htmlID).value = y.replace(regex, '');
		}
	}
});
var zprofile = {
	start: function () {
		zprofile.tabs();
	},
	tabs: function () {
		a = document.getElementById('tabs').getElementsByTagName('li');
		for (i = 0; i < a.length; i++) {
			b = a[i].firstChild.getAttribute('href').replace(/\/u(\d+)/, '').replace('#', 'profile');
			a[i].setAttribute('onclick', 'zprofile.load(this, "' + b + '");return false');
		}
	},
	load: function (a, b) {
		zprofile.loading(document.getElementById('profile-advanced-details'));
		$('#profile-advanced-details').load(a.firstChild.href.replace('?mode=', '') + ' #profile-advanced-details > .main-content');
		if (b == 'wall') {
			zprofile.reply();
		}
		if (b == 'profile') {
			setTimeout(zprofile.reload, 1500);
		}
		document.getElementsByClassName('activetab')[0].removeAttribute('class');
		a.setAttribute('class', 'activetab');
	},
	reload: function () {
		if (document.getElementById('wall-reload')) {
			elem = document.getElementById('wall-reload');
			elem.parentNode.removeChild(elem);
		}
		a = document.createElement('script');
		a.id = 'wall-reload';
		a.innerHTML = document.getElementById('main-content').getElementsByTagName('script')[2].innerHTML;
		document.getElementsByTagName('head')[0].appendChild(a);
	},
	reply: function () {
		$.get('/privmsg?mode=post_profile&u=' + location.pathname.match(/\d+/), function (a) {
			document.getElementById('profile-advanced-details').getElementsByClassName('main-content')[0].insertAdjacentHTML('beforebegin', '<div id="wall-reply" class="main-content"><form action="/privmsg?mode=post_profile" name="post" method="post"><div id="outter-wall"><div id="wall-preview" style="display:none" ondblclick="this.style.display = \'none\'" title="Double click to close this window"></div><textarea id="text_editor_textarea" cols="9" rows="3" name="message" placeholder="Message: ' + $(a).find('.frm-set dd').text().replace(/N/gi, 'N |').replace(/F/gi, 'F |') + '"></textarea></div>' + $('<div/>').append($(a).find('.frm-buttons input[type="hidden"]').clone()).html() + '<div><input type="submit" accesskey="s" tabindex="6" value="Send" name="post" onclick="zprofile.send();return false"><input type="submit" value="Preview" name="preview" onclick="zprofile.preview();return false"><input type="text" name="subject" id="subject" placeholder="Subject"></div></form></div>');
		});
	},
	send: function () {
		x = document.getElementById('text_editor_textarea');
		y = document.getElementById('subject');
		if (x.value != '') {
			$.post('/privmsg?mode=post_profile', $('#wall-reply form[name="post"]').serialize() + '&post=1', function (b) {
				if (b.indexOf('A new message') > 0) {
					$.post('/privmsg', $(b).find("form[method='post']").serialize() + '&post=1');
				}
				x.value = '';
				y.value = '';
				$.get(window.location + 'wall #profile-advanced-details', function (a) {
					$($(a).find('ol li.clearfix:first').html()).prependTo('#profile-advanced-details ol').hide().fadeIn('slow');
				});
			});
		} else {
			alert('Vui l?ng ði?n n?i dung cho tin nh?n')
		}
	},
	preview: function () {
		$.post('/privmsg?mode=post_profile', $('#wall-reply form[name="post"]').serialize() + '&preview=1', function (b) {
			$('#wall-preview').html($(b).find('.entry-content').html());
			document.getElementById('wall-preview').style.display = '';
		});
	},
	css: function () {
		$('head style').html($('#profile_field_2_' + cssID).val())
	},
	html: function () {
		$('#pun-head').html($('#profile_field_2_' + htmlID).val().replace('{USERNAME}', uname).replace('{USERID}', uid))
	},
	back: function () {
		$('#profile_field_2_' + cssID).val(cssDefault)
	},
	loading: function (dom) {
		dom.innerHTML = '<div id="profile-loading" class="main-content"><img src="http://i11.servimg.com/u/f11/16/80/27/29/ajax-l10.gif" /><br/>Loading...</div>';
	},
}