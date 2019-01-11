// ==UserScript==
// @name         ServiceNow Helper
// @namespace    https://github.com/JohnyHCL/ServiceNowHelper/raw/master/ServiceNowHelper.user.js
// @version      1.5
// @description  Adds a few features to the Service Now console.
// @author       Jan Sobczak
// @match        https://arcelormittalprod.service-now.com/*
// @downloadURL  https://github.com/JohnyHCL/ServiceNowHelper/raw/master/ServiceNowHelper.user.js
// @updateURL    https://github.com/JohnyHCL/ServiceNowHelper/raw/master/ServiceNowHelper.user.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// ==/UserScript==

'use strict';

var snMain = document.getElementById('dropzone1');
var snInc = document.getElementById('incident.form_header');
var bodyCount = document.body.childElementCount;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
if (snMain !== null){
    console.log('SNS');
    //ANCHOR TO THE ELEMENT THAT NEEDS TO BE MONITORED FOR PROPER ALERT HANDLING
    function anchor(){
        const wb = document.getElementsByClassName("widget_body")[1];
        var rects = wb.getElementsByTagName("rect");
        var rectslen = rects.length;
        console.log('how much rects ' + rectslen);
        return rectslen
    };

    //REFRESHES ALL WINDOWS
    function rfsh(){
        const elToClick = document.querySelectorAll('.icon-refresh')
        var i = 1;
        setTimeout(function(){
            for (i = 1; i < 6; i++){
                elToClick[i].click();
            };
        },300);
    };

    //PLAYS SOUND IF ALERT IS UNACKNOWLEDGED
    function action(){
        var ad = new Audio('http://newt.phys.unsw.edu.au/music/bellplates/sounds/equilateral_plate+second_partial.mp3');
        if (anchor() > 5){
            //        setInterval(function(){
            ad.play();
            //        }, 500);
        };
    };

    //EXECUTES ALL OF THE ABOVE
    setInterval(function(){
        rfsh();
        setTimeout(function(){
            anchor();
            setTimeout(function(){
                action();
            }, 1300);
        }, 1000);
    },60*1000);
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
} else if (snInc !== null) {
    console.log('AR and AT');

    var toV1 = document.getElementById('activity-stream-textarea');
    var toV2 = document.getElementById('activity-stream-work_notes-textarea');
    var incState = document.getElementById('incident.incident_state');
    var incSubState = document.getElementById('incident.u_sub_status');
    var incResCat = document.getElementById('incident.u_resolution_category');
    var incSubCat = document.getElementById('incident.u_resolution_sub_category');
    var incClsNod = document.getElementById('incident.close_code');

    function CreateButton(){
        var beforeNodeT = document.getElementsByClassName('vsplit col-sm-6')[3];
        var beforeNodeR = document.getElementsByClassName('vsplit col-sm-6')[1];
        var targetNodeT = document.getElementById('element.incident.assignment_group');
        var lowerDiv = document.createElement('div');
        var upperDiv = document.createElement('div');
        var newNodeTran = document.createElement('span');
        var newNodeRfc = document.createElement('span');
        var newNodeReoc = document.createElement('span');
        var newNodeKB = document.createElement('span');
        var newNodeRFCend = document.createElement('span');
        var newNodeResolve = document.createElement('span');
        var newNodeRGPaste = document.createElement('span');
        var textTran = document.createTextNode('Transfer');
        var textRfc = document.createTextNode('RFC');
        var textReoc = document.createTextNode('Reoccurrence')
        var textKB = document.createTextNode('KB');
        var textRFCend = document.createTextNode('RFC end');
        var textResolve = document.createTextNode('Resolve');
        var textRGPaste = document.createTextNode('RG Paste');
        newNodeTran.setAttribute('id', 'TransferringTo');
        newNodeRfc.setAttribute('id', 'RFC');
        newNodeReoc.setAttribute('id', 'Reoccurrence')
        newNodeKB.setAttribute('id', 'KB_open');
        newNodeRFCend.setAttribute('id', 'RFCend');
        newNodeResolve.setAttribute('id', 'autoResolve');
        newNodeRGPaste.setAttribute('id', 'RGPaste');
        newNodeTran.style.color = "red";
        newNodeResolve.style.color = "red"
        lowerDiv.style.cssText = "margin-left: 312px; margin-bottom: 8px;";
        upperDiv.style.cssText = "margin-left: 312px; margin-bottom: 8px;";
        newNodeReoc.style.cssText = "color: red; position: relative; left: 75px;";
        newNodeKB.style.cssText = "color: red; position: relative; left: 25px;";
        newNodeRFCend.style.cssText = "color: red; position: relative; left: 50px";
        newNodeRfc.style.cssText = "position: relative; left: 25px; color: red;";
        newNodeRGPaste.style.cssText = "position: relative; left: 50px; color: red;";
        newNodeTran.appendChild(textTran);
        newNodeRfc.appendChild(textRfc);
        newNodeReoc.appendChild(textReoc);
        newNodeKB.appendChild(textKB);
        newNodeRFCend.appendChild(textRFCend);
        newNodeResolve.appendChild(textResolve);
        newNodeRGPaste.appendChild(textRGPaste);
        beforeNodeT.insertBefore(lowerDiv, beforeNodeT.childNodes[9]);
        beforeNodeR.insertBefore(upperDiv, beforeNodeR.childNodes[7]);
        lowerDiv.appendChild(newNodeTran);
        upperDiv.appendChild(newNodeResolve);
        upperDiv.appendChild(newNodeRfc);
        upperDiv.appendChild(newNodeRFCend);
        upperDiv.appendChild(newNodeReoc);
        lowerDiv.appendChild(newNodeKB);
        lowerDiv.appendChild(newNodeRGPaste);
        EvListener();
    };

    function EvListener(){
        console.log('ev start');
        document.getElementById('TransferringTo').addEventListener('click', transfer, false);
        document.getElementById('RFC').addEventListener('click', RFC, false);
        document.getElementById('Reoccurrence').addEventListener('click', reoc, false);
        document.getElementById('KB_open').addEventListener('click', KB, false);
        document.getElementById('RFCend').addEventListener('click', function(){check(2)}, false);
        document.getElementById('autoResolve').addEventListener('click', function(){check(1)}, false);
        document.getElementById('RGPaste').addEventListener('click', RGPaste, false);
        console.log('ev ends');
    };

    function transfer(){
        console.log('transfer start');
        var fromV = document.getElementById('sys_display.incident.assignment_group').value;
        var check = document.getElementById('activity-stream-work_notes-textarea').parentElement.parentElement.parentElement.parentElement.className;
        var text = "Transferring to " +fromV + ".";
        console.log('before push');
        pasteAndPush(text);
        console.log('after push');
    };

    function RFC(){
        var numb = window.prompt('Enter RFC number');
        var date = window.prompt('When the RFC ends?');
        var text = "RFC" + numb + " closing incident at " + date;
        incState = document.getElementById('incident.incident_state');
        pasteAndPush(text);
        if (incState.value == 1){
            incState.value = 2;
            incState.onchange();
        };
    };

    function reoc(){
        incState = document.getElementById('incident.incident_state');
        console.log(incState.value);
        if (incState.value == 6){
            var text = "Alert reoccurrence."
            var reopen = document.getElementById('incident.u_reopen_reason');
            incState.value = 1;
            incState.onchange();
            pasteAndPush(text);
            setTimeout(function(){
                reopen.value = "Re-occurrence";
                reopen.onchange();
            },300);
        } else {
            alert('Incident must be closed in order to reopen it');
        };
    };

    function KB(){
        var target = document.getElementById('incident.em_alert.incident_table').getElementsByClassName('list2_body')[0].getElementsByClassName('linked')[3].innerHTML;
        //            if (target == null){
        //                alert('There is no KB article for this alert');
        //            } else {
        window.open('https://arcelormittalprod.service-now.com' + target, '_blank');
        //            };
    };

    function RGPaste(){
        var RGpaste = GM_getValue('targetRG');
        var text = "Transferring to " + RGpaste + "."
        var assignment = document.getElementById('sys_display.incident.assignment_group');
        assignment.focus()
        setTimeout(function(){
            GM_setClipboard(RGpaste);
           // assignment.value = RGpaste;
            pasteAndPush(text);
        },500);
    };

    function pasteAndPush(text){
        var check = toV2.parentElement.parentElement.parentElement.parentElement.className;
        if (check == 'ng-hide'){
            toV1.value += text;
            angular.element(jQuery('#activity-stream-textarea')).triggerHandler('input');
        } else if (check == "") {
            toV2.value += text;
            angular.element(jQuery('#activity-stream-work_notes-textarea')).triggerHandler('input');
        };
    };
    CreateButton();

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function incStateFunc(){
        incState.value = 6;
        incState.onchange();
    };

    function incSubStateFunc(){
        incState.onchange();
        incSubState.value = "Permanently Resolved";
        incSubState.onchange();
    };

    function incResCatFunc(){
        incSubState.onchange();
        incResCat.value = "Application";
        incResCat.onchange();
    };

    function incSubCatFunc(){
        incResCat.onchange();
        incSubCat.value = "Others";
        incSubCat.onchange();
    };

    function incClsNodFunc(){
        incSubCat.onchange()
        incClsNod.value = "Other";
        incClsNod.onchange();
    };

    function change(){
        if(incState.value != 6){
            console.log(incState.value);
            incStateFunc();
            console.log('CHANGED INC STATE');
        };
        if(incSubState.childElementCount == 8 && incSubState.value !== "Permanently Resolved"){
            incSubStateFunc();
            console.log('CHANGED INC SUB STATE');
        };
        if(incResCat.getAttribute('aria-required') == 'true' && incResCat.value !== "Application"){
            incResCatFunc();
            console.log('CHANGED INC RES CAT');
        };
        if(incSubCat.childElementCount > 30 && incSubCat.value !== "Others"){
            incSubCatFunc();
            console.log('CHANGED INC SUB CAT');
        };
        if(incClsNod.childElementCount == 6 && incClsNod.value !== "Other"){
            incClsNodFunc();
            console.log('CHANGED INC CLS NOD');
        };
        //if lower than 100, onchange() on  incSubCatFunc() will not fire
        setTimeout(function(){
            checker()
        }, 100);
    };

    function checker(){
        if(incState.value != 6 || incSubState.value !== "Permanently Resolved" || incResCat.value !== "Application" || incSubCat.value !== "Others" || incClsNod.value !== "Other"){
            change()
            console.log('change');
        } else {
            console.log('DONE');
        };
    };

    function check(x){
        if (incState.value != 2){
            alert('Incident status must be "Work in Progress" before resolving it');
        } else {
            switch(x){
                case 1:
                    checker();
                    break;
                case 2:
                    checker();
                    setTimeout(function(){
                        document.getElementById('incident.close_notes').value = "RFC has ended.";
                        angular.element(jQuery('#incident.close_notes')).triggerHandler('input');
                        console.log('DONE');
                    },800);
                    break;
            };
        };
    };
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
} else if (bodyCount < 45){
    console.log('AutoTransfer');
    function RGcopy(){
        var KBRG = document.getElementById('article').childNodes[4].childNodes[0].innerHTML.substring(0,24);
        if(KBRG == "Transfer the incident to"){
            var RG = document.getElementById('article').childNodes[4].childNodes[0].innerHTML.substring(27,200).slice(0,-3);
            GM_setValue('targetRG', RG);
            window.close();
        };
    };
    RGcopy();
};
