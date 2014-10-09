(function($) {
    $.zprofile = function(options) {
        var settings = $.extend({
            htmlID: 0,
            cssID: 0,
            tag: ['<script>', '<html>', '<iframe>', '<body>', '<head>'],
            cssDefault: 0,
            version: 0,
        }, options);
        var profile = {
            '{USER_ID}': 0,
            '{USER_NAME}': 0,
            '{PROFILE_ID}': 0,
            '{PROFILE_NAME}': 0,
            '{PROFILE_RANK}': 0,
            '{PROFILE_IMG}': 0,
        };
        var profile_rep = {
            rep: 0,
            thanks: 0,
            thanks_given: 0,
            p_votes: 0,
            n_votes: 0,
            p_votes_given: 0,
            n_vote_given: 0,
        };
        var profile_holder = [], rep_holder = [];
        init = function() {
            if (document.getElementById('tabs') && location.pathname.substring(0, 2) == '/u') {
                $('script').detach();
                this.prepare(function() {
                    this.checkLocation('', function() {
                            update($('#field_id' + settings.cssID + ' .field_uneditable').text(), $('#field_id' + settings.htmlID + ' .field_uneditable').text());
                            $('#profile_field_2_' + settings.cssID).after('<a style="cursor:pointer" onclick="zprofile.back()">Default</a>');
                        },
                        function() {
                            $.get('/u' + location.pathname.match(/[0-9]/), function(data) {
                                css = $(data).find('#field_id' + settings.cssID + ' .field_uneditable').text();
                                html = $(data).find('#field_id' + settings.htmlID + ' .field_uneditable').text();
                                update(css, html);
                            });
                        });
                    this.checkLocation('wall', function() {
                        this.zeditor.editor();
                    });
                });
            }

        };
        prepare = function(finished) {
            profile['{USER_NAME}'] = _userdata['username'];
            profile['{USER_ID}'] = _userdata['user_id'];
            profile['{PROFILE_NAME}'] = $('#profile-advanced-right .h3 span').first().text();
            profile['{PROFILE_ID}'] = location.pathname.match(/[0-9]/).toString();
            profile['{PROFILE_RANK}'] = $('#profile-advanced-right .main-content').first().text();
            profile['{PROFILE_IMG}'] = $('#profile-advanced-right .main-content img')[0].outerHTML;
            if (profile['{user_name}'] != profile['{profile_name}']) {
                $('#field_id' + settings.htmlID + ', #field_id' + settings.cssID).hide().next().hide();
            }
            this.checkLocation('stats', function() {
                setReputation('#profile-advanced-details');
                finished();
            }, function() {
                $.get('/u' + location.pathname.match(/[0-9]/) + 'stats', function(data) {
                    setReputation(data);
                    finished();
                });
            });

        };
        update = function(css, html) {
            $('head').append('<style>' + css + '</style>');
            for (var a in profile) {
                profile_holder.push(profile[a]);
            }
            $('#profile-advanced-layout').before(replaceArray(html, Object.keys(profile), profile_holder));
        };
        checkLocation = function(mode, succ, fail) {
            if (typeof(succ) === 'function' && location.pathname.replace('/u', '').replace(/[0-9]/g, '') == mode) {
                succ();
            }
            if (typeof(fail) === 'function' && location.pathname.replace('/u', '').replace(/[0-9]/g, '') != mode) {
                fail();
            }
        };
        loading = function(where, b) {
            a = document.getElementById('profile-loading');
            $('<div id="profile-loading" class="main-content" style="opacity: 1"><img src="http://i11.servimg.com/u/f11/16/80/27/29/ajax-l10.gif" /><br/>Loading...</div>').appendTo(where);
            if (a) b == 'hide' ? a.style.opacity = '0' : a.style.opacity = '1';
        };
        replaceArray = function(content, find, replace) {
            var replaceString = content;
            var regex;
            for (var i = 0; i < find.length; i++) {
                regex = new RegExp(find[i], "g");
                replaceString = replaceString.replace(regex, replace[i]);
            }
            return replaceString;
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
                    alert('Please enter the message')
                }
            },
            preview: function() {
                $.post('/privmsg?mode=post_profile', $('#wall-reply form[name="post"]').serialize() + '&preview=1', function(b) {
                    $('#wall-preview').html($(b).find('.entry-content').html());
                    document.getElementById('wall-preview').style.display = '';
                });
            },
        };
        setReputation = function(dom) {
            $(dom).find('.stats-field:eq(0) li').each(function(a) {
                profile_rep[a] = $(this).text().match(/[0-9]/);
            })
        };
        init();
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