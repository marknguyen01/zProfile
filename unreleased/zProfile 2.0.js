(function($) {
    $.zprofile = function(options) {
        var settings = $.extend({
            htmlID: 0,
            cssID: 0,
            tag: ['<script>', '<html>', '<iframe>', '<body>', '<head>'],
            cssDefault: 0,
            version: 0,
        }, options);
        var variables = {
            user_id: 0,
            user_name: 0,
            profile_id: 0,
            profile_name: 0,
            profile_rank: 0,
            profile_img: 0,
            profile_rep: 0,
            profile_thanks: 0,
            profile_thanks_given: 0,
            profile_p_votes: 0,
            profile_n_vote: 0,
            profile_p_votes_given: 0,
            profile_n_votes_given: 0,
        };
        init = function() {
            if (document.getElementById('tabs') && location.pathname.substring(0, 2) == '/u') {
                this.prepare();
                document.getElementById('profile-advanced-layout').insertAdjacentHTML('beforeend', '<div id="copyright"><b>zProfile by Zero</b></div>');

            }
            this.checkLocation('', function() {
                    updateUI($('#field_id' + settings.cssID + ' .field_uneditable').text(), $('#field_id' + settings.htmlID + ' .field_uneditable').text());
                    $('#profile_field_2_' + settings.cssID).after('<a style="cursor:pointer" onclick="zprofile.back()">Default</a>');
                },
                function() {
                    $.get('/u' + location.pathname.match(/[0-9]/), function(data) {
                        css = $(data).find('#field_id' + settings.cssID + ' .field_uneditable').text();
                        html = $(data).find('#field_id' + settings.htmlID + ' .field_uneditable').text();
                        updateUI(css, html);
                    });
                });
            this.checkLocation('stats', function() {
                reputation('#profile-advanced-details');
            }, function() {
                $.get('/u' + location.pathname.match(/[0-9]/) + 'stats', function(data) {
                    reputation(data);
                });
            });
            this.checkLocation('wall', function() {
                this.zeditor.editor();
            });
            $('script').detach();
        };
        prepare = function() {
            uname = _userdata['username'];
            uid = _userdata['user_id'];
            if (settings.guest && document.getElementById('logout') == null) {
                document.body.style.display = 'none';
                alert('Please login to use this feature');
                location.href = 'http://' + location.host;
            }
            if (document.getElementById('logout')) {
                $('#profile-advanced-right .module.main').has('noscript').remove();
                $('#main-content div').first().remove();
            }
            if (uname != $('#profile-advanced-right .h3 span').first().text()) {
                $('#field_id' + settings.htmlID + ', #field_id' + settings.cssID).hide().next().hide();
            }
        };
        updateUI = function(css, html) {
            $('head').append('<style>' + css + '</style>');
            $('#profile-advanced-layout').before(html);
        };
        checkLocation = function(mode, succ, fail) {
            if (typeof(succ) === 'function' && location.pathname.replace('/u', '').replace(/[0-9]/g, '') == mode) {
                succ();
            }
            if (typeof(fail) === 'function' && location.pathname.replace('/u', '').replace(/[0-9]/g, '') != mode) {
                fail();
            }
        };

        tabs = function(name, href) {

        };
        loading = function(where, b) {
            a = document.getElementById('profile-loading');
            $('<div id="profile-loading" class="main-content" style="opacity: 1"><img src="http://i11.servimg.com/u/f11/16/80/27/29/ajax-l10.gif" /><br/>Loading...</div>').appendTo(where);
            if (a) b == 'hide' ? a.style.opacity = '0' : a.style.opacity = '1';
        };
        zeditor = {
            editor: function() {
                $.get('/privmsg?mode=post_profile&u=' + location.pathname.match(/\d+/), function(a) {
                    document.getElementById('profile-advanced-details').getElementsByClassName('main-content')[0].insertAdjacentHTML('beforebegin', '<div id="wall-reply" class="main-content"><form action="/privmsg?mode=post_profile" name="post" method="post"><div id="outter-wall"><div id="wall-preview" style="display:none" ondblclick="this.style.display = \'none\'" title="Double click to close this window"></div><textarea id="text_editor_textarea" cols="9" rows="3" name="message" placeholder="Message: ' + $(a).find('.frm-set dd').text().replace(/N/gi, 'N |').replace(/F/gi, 'F |') + '"></textarea></div>' + $('<div/>').append($(a).find('.frm-buttons input[type="hidden"]').clone()).html() + '<div><input type="submit" accesskey="s" tabindex="6" value="Send" name="post"><input type="submit" value="Preview" name="preview"><input type="text" name="subject" id="subject" placeholder="Subject"></div></form></div>');
                    document.forms['post']['post'].addEventListener('click', function(event) {
                        event.preventDefault();
                        zeditor.send();
                    });
                    document.forms['post']['preview'].addEventListener('click', function(event) {
                        event.preventDefault();
                        zeditor.preview();
                    });
                });
            },
            send: function() {
                x = document.getElementById('text_editor_textarea');
                y = document.getElementById('subject');
                if (x.value != '') {
                    $.post('/privmsg?mode=post_profile', $('#wall-reply form[name="post"]').serialize() + '&post=1', function(b) {
                        if (b.indexOf('A new message') > 0) {
                            $.post('/privmsg', $(b).find("form[method='post']").serialize() + '&post=1');
                        }
                        x.value = '';
                        y.value = '';
                        $.get(window.location + 'wall #profile-advanced-details', function(a) {
                            $($(a).find('ol li.clearfix:first').html()).prependTo('#profile-advanced-details ol').hide().fadeIn('slow');
                        });

                    });
                } else {
                    alert('Vui lòng điền nội dung cho tin nhắn')
                }
            },
            preview: function() {
                $.post('/privmsg?mode=post_profile', $('#wall-reply form[name="post"]').serialize() + '&preview=1', function(b) {
                    $('#wall-preview').html($(b).find('.entry-content').html());
                    document.getElementById('wall-preview').style.display = '';
                });
            },
        };
        reputation = function(dom) {
            $(dom).find('.stats-field:eq(0)')
        };
        init();
        tabs();
        console.log(variables.profile_name);
    }
}(jQuery));
$(function() {
    $.zprofile({
        htmlID: '3',
        cssID: '2',
        cssDefault: '/h7-',
        version: 'punbb',
    });
});