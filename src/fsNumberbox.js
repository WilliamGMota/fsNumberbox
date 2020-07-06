/**
*  fsNumberbox v1.0.0 - jQuery 
*  (c) 2012 William da Mota
*
*  http://www.friendship.com.br
*  fsNumerbox for jQuery is freely distributable under the terms of an MIT-style license.
*  For details, see the web site: https://github.com/WilliamGMota/fsNumberbox.git
*/
(function ($) {
    $.fn.fsNumberbox = function (settings) {
        settings = $.extend(
        {
            digitgroupsymbol: '.',
            decimalsymbol: ',',
            length: 16,
            decimals: 2,
            allownegative: false
        }, settings);

        return this.each(function () {
            var input = $(this);

            input.focus(function () {
                var sValue = $(this).val();
                var oFind = new RegExp("\\" + settings.digitgroupsymbol, "g");
                /* Remove digit group symbols */
                if (sValue !== "") {
                    sValue = sValue.replace(oFind, "");
                    this.value = sValue;
                    setSelection(this, 0, sValue.length);
                }
                $(this).css('text-align', 'left');
            });

            input.blur(function () {
                this.value = formatValue($(this).val());
                $(this).css('text-align', 'right');
            });

            function keypressEvent(e) {
                var objSelection = getSelection(this);
                var oFind = new RegExp("//" + settings.digitgroupsymbol, "g");

                /* Error when browse or OS dont send de keypress event in some situations */
                if (isNaN(input.val().replace(oFind, "").replace(settings.decimalsymbol, "."))) {
                    this.value = "";
                    return false;
                }
                /* Firefox send key = 0 for home and end */
                if (e.which === 0 || e.which === 13) {
                    return true;
                }
                if (e.which === 8 ||
                    (e.which >= 48 && e.which <= 57) ||
                    e.which === 44 ||
                    e.which === 46 ||
                    e.which === 45 ||
                    e.which === 43 ||
                    e.which === 57) {
                    return buildText(input, e.which, objSelection, this);
                }
                else {
                    return false;
                }
            }
            function keydownEvent(e) {
                var objSelection = getSelection(this);

                if ((e.which >= 48 && e.which <= 57) ||
                    (e.which >= 96 && e.which <= 105) ||
                    e.which === 8 ||
                    e.which === 35 ||
                    e.which === 36 ||
                    e.which === 37 ||
                    e.which === 39 ||
                    e.which === 188 ||
                    e.which === 190 ||
                    e.which === 194 ||
                    e.which === 110 ||
                    e.which === 189 ||
                    e.which === 187 ||
                    e.which === 107 ||
                    e.which === 109 ||
                    e.which === 57 ||
                    e.which === 46 ||
                    e.which === 9 ||
                    e.which === 13) {

                    /* Pressed delete key */
                    if (e.which === 46) {
                        return buildText(input, -1, objSelection, this);
                    }
                    else if (e.which === 8) {
                        return buildText(input, 8, objSelection, this);
                    }
                    else {
                        return true;
                    }
                }
                else {
                    return false;
                }
            }

            function buildText(objInput, keycode, objSelection, objThis) {
                var sText = objInput.val();
                var sLeftText = '', sRightText = '', sChar = '', sNewText;

                if (objSelection.start > 0) {
                    sLeftText = sText.substring(0, objSelection.start);
                }
                if (objSelection.end !== sText.length) {
                    sRightText = sText.substring(objSelection.end);
                }
                /* Pressed delete key */
                if (keycode === -1) {
                    if (objSelection.start === objSelection.end) {
                        sRightText = sRightText.substring(1);
                    }
                }
                /*Pressed backspace */
                else if (keycode === 8) {
                    if (objSelection.start === objSelection.end) {
                        sLeftText = sLeftText.substring(0, objSelection.start - 1);
                    }
                }
                /* Pressed comma or dot */
                else if (keycode === 44 || keycode === 46) {
                    sNewText = sLeftText + sRightText;
                    if (settings.decimals === 0 || sNewText.indexOf(settings.decimalsymbol) > -1) {
                        return false;
                    }
                    sChar = settings.decimalsymbol;
                    sNewText = sLeftText + sChar + sRightText;
                    if (isFormatValid(sNewText)) {
                        objThis.value = sNewText;
                        setSelection(objThis, objSelection.start + 1, objSelection.start + 1);
                    }
                    return false;
                }
                /* Pressed less or more */
                else if (keycode === 45 || keycode === 43) {
                    if ((keycode === 45 && settings.allownegative === false) ||
                        (keycode === 45 && sText.indexOf("-") > -1) ||
                        (keycode === 43 && sText.indexOf("-") === -1)) {
                    }
                    else if (keycode === 45) {
                        sNewText = "-" + sText;
                        if (isFormatValid(sNewText)) {
                            objThis.value = sNewText;
                            setSelection(objThis, objSelection.start + 1, objSelection.end + 1);
                        }
                    }
                    else if (keycode === 43) {
                        sNewText = sText.substring(1);
                        if (isFormatValid(sNewText)) {
                            objThis.value = sNewText;
                            setSelection(objThis, objSelection.start - 1, objSelection.end - 1);
                        }
                    }
                    return false;
                }
                else {
                    sChar = String.fromCharCode(keycode);
                }
                sNewText = sLeftText + sChar + sRightText;

                return isFormatValid(sNewText);
            }

            function isFormatValid(sNewText) {
                var aValues;
                aValues = sNewText.split(settings.decimalsymbol);

                if (aValues[0].length > settings.length - settings.decimals) {
                    return false;
                }
                if (aValues.length > 1) {
                    if (aValues[1].length > settings.decimals) {
                        return false;
                    }
                }
                return true;
            }

            function getSelection(objInput) {

                /* mozilla / dom 3.0 */
                if ('selectionStart' in objInput) {
                    var l = objInput.selectionEnd - objInput.selectionStart;
                    return { start: objInput.selectionStart, end: objInput.selectionEnd, length: l, text: objInput.value.substr(objInput.selectionStart, l) };
                }

                /* explorer */
                else if (document.selection) {
                    objInput.focus();
                    var r = document.selection.createRange();
                    if (r === null) {
                        return 0;
                    }
                    var re = objInput.createTextRange();
                    var rc = re.duplicate();
                    re.moveToBookmark(r.getBookmark());
                    rc.setEndPoint('EndToStart', re);
                    return { start: rc.text.length, end: rc.text.length + r.text.length, length: r.text.length, text: r.text };
                }

                /* browse not supported */
                else {
                    alert('This browse not support numbers edit. Contact the developer system.');
                    return { start: 0, end: 0, length: objInput.value.length, text: '' };
                }
            }

            function setSelection(objInput, iPosStart, iPosEnd) {

                /* mozilla / dom 3.0 */
                if (objInput.setSelectionRange) {
                    objInput.setSelectionRange(iPosStart, iPosEnd);
                }

                /* explorer */
                else if (objInput.createTextRange) {
                    var range = objInput.createTextRange();
                    range.collapse(true);
                    range.moveEnd('character', iPosEnd);
                    range.moveStart('character', iPosStart);
                    range.select();
                }

                /* browse not supported */
                else {
                    alert('This browse not support numbers edit. Contact the developer system.');
                }
            }

            function formatValue(sTexto) {
                var aValues, sReturn = "", sDecimals = "", bNegative = false, iDecimals = 0, dValue = 0, iCheckDecimals = 0;
                var oFind = new RegExp("//" + settings.digitgroupsymbol, "g");

                //Round the value
                sTexto = (sTexto === "") ? "0" : sTexto;
                sTexto = (sTexto === undefined) ? "0" : sTexto;
                sTexto = sTexto.replace(oFind, "").replace(settings.decimalsymbol, ".");
                sTexto = (isNaN(sTexto)) ? "0" : sTexto;
                if (settings.decimals > 0) {
                    dValue = Math.round(parseFloat(sTexto) * Math.pow(10, settings.decimals)) / Math.pow(10, settings.decimals);
                } else {
                    dValue = Math.round(parseFloat(sTexto));
                }
                
                sTexto = String(dValue).replace(".", settings.decimalsymbol);
                
                //Split the parts
                aValues = sTexto.split(settings.decimalsymbol);

                //Remove negative symbol
                if (aValues[0].length > 0) {
                    if (aValues[0].substring(0, 1) === "-") {
                        aValues[0] = aValues[0].substring(1);
                        bNegative = true;
                    }
                }

                //Build format part integer of number with group symbol
                for (var i = aValues[0].length, j = 0; i > 0; i--, j++) {
                    if (j % 3 === 0 && i !== aValues[0].length) {
                        sReturn = settings.digitgroupsymbol + sReturn;
                    }
                    sReturn = aValues[0].substring(i - 1, i) + sReturn;
                }
                sReturn = (sReturn === undefined || sReturn === null) ? "0" : sReturn;

                //Insert negative symbol
                if (bNegative === true) {
                    sReturn = "-" + sReturn;
                }

                //Insert decimal part of number.
                if (settings.decimals > 0) {
                    if (aValues.length > 1) {
                        aValues[1] = (aValues[1] === "") ? "0" : aValues[1];
                        for (var i = 0; i <= aValues[1].length; i++) {
                            if (aValues[1].substring(i, 1) === "0") {
                                iCheckDecimals++;
                            }
                        }
                        iDecimals = parseInt(aValues[1]);
                        iDecimals = Math.round(iDecimals * Math.pow(10, settings.decimals));
                    }
                    iDecimals = parseInt(iDecimals);
                    sDecimals = repl("0", iCheckDecimals) + iDecimals + Array(settings.decimals + 1).join("0")
                    sReturn += settings.decimalsymbol + sDecimals.substring(0, settings.decimals);
                }
                
                return sReturn;
            }
            function repl(s, n) {
                var r = '';
                while (n) {
                    if (n & 1) { r += s; }
                    s += s;
                    n >>= 1;
                }
                return r;
            }

            this.value = formatValue($(this).val());
            $(this).css('text-align', 'right');

            input.bind('keypress', keypressEvent);
            input.bind('keydown', keydownEvent);
        });
    }
})(jQuery);
