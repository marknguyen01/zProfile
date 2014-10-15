(function($) {
    $.zprofile = function(options) {
        var settings = $.extend({
            htmlID: 0,
            cssID: 0,
            tag: ['<script>', '<html>', '<iframe>', '<body>', '<head>'],
            cssDefault: 0,
        }, options);
        var profile = {
            '{USER_ID}': 0,
            '{USER_NAME}': 0,
            '{PROFILE_ID}': 0,
            '{PROFILE_NAME}': 0,
            '{PROFILE_RANK}': 0,
            '{PROFILE_IMG}': 0,
            '{TAB_ACTIVE}': 'profile-tab',
        };
        var profile_rep = {
            '{PROFILE_REP}': 0,
            '{PROFILE_THANKS}': 0,
            '{PROFILE_THANKS_GIVEN}': 0,
            '{PROFILE_P_VOTES}': 0,
            '{PROFILE_N_VOTES}': 0,
            '{PROFILE_P_VOTES_GIVEN}': 0,
            '{PROFILE_N_VOTES_GIVEN}': 0,
        };
        var holder = [];
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
            profile['{USER_ID}'] = _userdata['user_id'].toString();
            profile['{PROFILE_NAME}'] = $('#profile-advanced-right .h3').eq(1).text().replace(' friends', '');
            profile['{PROFILE_ID}'] = location.pathname.match(/[0-9]/).toString();
            profile['{PROFILE_RANK}'] = $('#profile-advanced-right .main-content').first().text();
            profile['{PROFILE_IMG}'] = $('#profile-advanced-right .main-content img')[0].outerHTML;
            // if (profile['{USER_NAME}'] != profile['{PROFILE_NAME}']) {
            //    $('#field_id' + settings.htmlID + ', #field_id' + settings.cssID).hide().next().hide();
            // }
            for (var a in profile) {
                holder.push(profile[a]);
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
            html = replaceArray(html, Object.keys(profile).concat(Object.keys(profile_rep)), holder);
            html = html.replace('{PROFILE_BODY}', function() {
                return $('#profile-advanced-details > .main-content').html();
                $('#profile-advanced-details').remove();
            });
            console.log('Done. Thanks for using zProfile. Find me on github @ mysticzero');
            document.getElementById('profile-advanced-layout').insertAdjacentHTML('beforebegin', html);
            $('div[rel="profile-tab"] a[href="' + location.pathname + '"]').parent().addClass('activetab');
            $('#profile_field_2_3').keyup(function() {
                for (var i in settings.tag) {
                    regex = new RegExp(settings.tag[i], 'i');
                    if (regex.test(this.value)) {
                        alert('No ' + settings.tag[i] + ' allowed');
                        this.value = this.value.replace(regex, '');
                    }
                }
            });
            if (location.pathname.replace('/u', '').replace(/[0-9]/g, '') == '' && (profile['{USER_NAME}'] == profile['{PROFILE_NAME}'] || $('a[href^="/admin/index.forum?mode=edit"]').length > 0)) {
                $('<dt>Edit</dt>').appendTo($('#profile-left-body dl:has(".field_editable")')).toggle(function() {
                        var x = $(this).parent();
                        $(this).text('Save');
                        $(x).find('.field_editable').removeClass('invisible');
                        $(x).find('.field_uneditable').addClass('invisible');
                    },
                    function() {
                        var x = $(this).parent();
                        $(this).text('Edit');
                        $(x).find('.field_editable').addClass('invisible');
                        $(x).find('.field_uneditable').removeClass('invisible');
                        var content = new Array();
                        $(x).find('[name]').each(function() {
                            var type_special = $(this).is('input[type=radio],input[type=checkbox]');
                            if ((type_special && $(this).is(':checked')) || !type_special) {
                                content.push(new Array($(this).attr('name'), $(this).attr('value')));
                            }
                        });
                        ajax($(x).attr('id').substring(8, $(x).attr('id').length), profile['{PROFILE_ID}'], content);
                    });
            }
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
                    document.getElementsByClassName('pagination')[0].insertAdjacentHTML('beforebegin', '<div id="profile-reply"><form action="/privmsg?mode=post_profile" name="profile-reply" method="post"><div id="profile-reply-outer"><div id="profile-reply-preview" style="display:none" ondblclick="this.style.display = \'none\'" title="Double click to close this window"></div><textarea id="text_editor_textarea" cols="9" rows="3" name="message" placeholder="Message: ' + $(a).find('.frm-set dd').text().replace(/N/gi, 'N |').replace(/F/gi, 'F |') + '"></textarea></div><div id="profile-reply-input">' + $('<div/>').append($(a).find('.frm-buttons input[type="hidden"]').clone()).html() + '<input type="submit" accesskey="s" tabindex="6" value="Send" name="post"><input type="submit" value="Preview" name="preview"><input type="text" name="subject" id="subject" placeholder="Subject"></div></form></div>');
                    document.forms['profile-reply']['post'].addEventListener('click', function(event) {
                        event.preventDefault();
                        zeditor.send();
                    });
                    document.forms['profile-reply']['preview'].addEventListener('click', function(event) {
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
                    $('#profile-reply-preview').html($(b).find('.entry-content').html());
                    document.getElementById('profile-reply-preview').style.display = '';
                });
            },
        };
        setReputation = function(dom) {
            $(dom).find('.stats-field:eq(0) li').each(function(a) {
                profile_rep[Object.keys(profile_rep)[a]] = $(this).text().match(/[0-9]/).toString();
                holder.push(profile_rep[Object.keys(profile_rep)[a]]);
            })
        };
        ajax = function(field_id, user_id, content) {
            var x = document.getElementById('logout').getAttribute('href').split(/&tid=|&key=/g)[1];
            $.post("/ajax_profile.forum?jsoncallback=?", {
                id: field_id,
                user: user_id,
                active: "1",
                content: $.toJSON(content),
                tid: x,
            }, function(data) {
                $('#field_id' + field_id + ' .field_uneditable').html(data[field_id]);
            }, "json");
        };
        init();
    }
}(jQuery));
$(function() {
    $.zprofile({
        htmlID: '3',
        cssID: '2',
        cssDefault: '/h7-',
    });
});