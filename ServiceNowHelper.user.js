// ==UserScript==
// @name         ServiceNow Helper
// @namespace    https://github.com/JohnyHCL/ServiceNowHelper/raw/master/ServiceNowHelper.user.js
// @version      2.1.4
// @description  Adds a few features to the Service Now console.
// @author       Jan Sobczak
// @match        https://arcelormittalprod.service-now.com/*
// @match        https://arcelormittalqa.service-now.com/*
// @match        http://web-expl.appliarmony.net/OSP/RFC/*
// @downloadURL  https://github.com/JohnyHCL/ServiceNowHelper/raw/master/ServiceNowHelper.user.js
// @updateURL    https://github.com/JohnyHCL/ServiceNowHelper/raw/master/ServiceNowHelper.user.js
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

'use strict';

GM_getValue('RFCMESSAGE', false);
GM_getValue('CONTACTMESSAGE', false);

function RUNALL(){

    if(document.readyState === 'complete'){

        clearTimeout(runallTimeout);
        console.log('runall clear timeout');

        var snMain = document.getElementById('dropzone1');
        var snInc = document.getElementById('incident.form_header');
        var bodyCount = document.body.childElementCount;

        function arraySplit(arr){
                console.log(arr);
                var i = 0;
                var arrSplited = []
                while(i < arr.length){
                    arrSplited.push(arr[i].split(' to '));
                    i++;
                };
                getHours(arrSplited, arr.length);
            };

        function getHours(arr, length){
            var startDate = [];
            var temp = [];
            var endDate = [];
            var i = 0;
            var j = 0;
            while(i < length){
                startDate.push(new Date(arr[i][0]));
                temp.push(new Date(startDate[i]));
                if(arr[i][1].length > 7){
                    endDate.push(new Date(arr[i][1]));
                } else {
                    if(arr[i][1].length == 4){
                        endDate.push(new Date((temp[i]).setHours(arr[i][1].slice(0,1),(arr[i][1].slice(-2)))));
                    } else {
                        endDate.push(new Date((temp[i]).setHours(arr[i][1].slice(0,2),(arr[i][1].slice(-2)))));
                    };
                };
                i++
            };
            checkTime(startDate, endDate);
        };

        function checkTime(sD, eD){
            var rfcSiteClose = GM_getValue('rfcSiteClose');
            var i = 0;
            var cD = new Date();
            var threshold = 30*60*1000;
            var ifFound = 0;
            while(i < sD.length){
                //     if(eD && eD.constructor === Array && eD.length === 0){

                //   } else {
                if(cD > sD[i] && cD < eD[i]){
                    alert('RFC found, the data has been pasted in Work Notes field');
                    console.log('RFC found, value to paste stored');
                    storeValue(eD[i]);
                    ifFound = true;
                    GM_setValue('rfcReturn', 3)
                    break;
                } else if(cD > (sD[i].getTime() - threshold) && cD < (eD[i].getTime() + threshold)){
                    alert('RFC is going to start or has already ended (time range is 30 minutes)\nDespite that, value has been stored and pasted into the Work Notes field');
                    storeValue(eD[i]);
                    ifFound = true;
                    GM_setValue('rfcReturn', 3);
                    break;
                };
                i++;
                //      };
            };
            if(!ifFound){
                GM_setValue('rfcReturn', 2);
                if(rfcSiteClose){
                    alert('There is no RFC for this server right now')
                   window.close();
                };
            };
        };

        function storeValue(eT){
            var endTime = eT;
            var zeroOrNot = eT.getMinutes();
            var rfcSiteClose = GM_getValue('rfcSiteClose');
            var endTimeToPaste;
            if(String(eT.getMinutes()).length == 1){
                endTimeToPaste = eT.getFullYear() + '-' + Number(eT.getMonth() + 1) + '-' + eT.getDate() + ' at ' + eT.getHours() + ':' + eT.getMinutes() + '0';
            } else {
                endTimeToPaste = eT.getFullYear() + '-' + Number(eT.getMonth() + 1) + '-' + eT.getDate() + ' at ' + eT.getHours() + ':' + eT.getMinutes();
            };
            console.log(endTimeToPaste)
            GM_setValue('rfcTimeEnd', endTimeToPaste);
            if(rfcSiteClose){
               window.close();
            };
        };

        //SNOW MAIN/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        if (snMain !== null){
            var ad = new Audio('http://newt.phys.unsw.edu.au/music/bellplates/sounds/equilateral_plate+second_partial.mp3');
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
                if (anchor() > 5){
                    //            setInterval(function(){
                    ad.play();
                    //            }, 500);
                };
            };

            //EXECUTES ALL OF THE ABOVE
            setInterval(function(){
                rfsh();
                setTimeout(function(){
                    action();
                }, 10000);
            },60*1000);
            //INCIDENTS/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        } else if (snInc !== null) {
            console.log('AR and AT');

            var toV1 = document.getElementById('activity-stream-textarea');
            var toV2 = document.getElementById('activity-stream-work_notes-textarea');
            var incState = document.getElementById('incident.incident_state');
            var incSubState = document.getElementById('incident.u_sub_status');
            var incResCat = document.getElementById('incident.u_resolution_category');
            var incSubCat = document.getElementById('incident.u_resolution_sub_category');
            var incClsNod = document.getElementById('incident.close_code');
            GM_setValue('transferOnly', true);

            function userAssign(){
                var tabs2 = document.getElementById('tabs2_section');
                var dest = tabs2.childNodes[0].childNodes[0];
                dest.click();
                var reqForVisible = document.getElementById('sys_display.incident.u_requested_for');
                var assignmentGroup = document.getElementById('sys_display.incident.assignment_group');
                if(reqForVisible.value == "" && assignmentGroup.value == "BD North - Infrastructure - Operations Bridge - HCL"){
                    console.log('Assign User');
                    var userID = document.getElementById('add_me_locked.incident.watch_list').getAttribute('data-user-id');
                    var uName = document.getElementById('add_me_locked.incident.watch_list').getAttribute('data-user');
                    var reqFor = document.getElementById('incident.u_requested_for');
                    var assignedTo = document.getElementById('incident.assigned_to')
                    var assignedToVisible = document.getElementById('sys_display.incident.assigned_to');
                    reqForVisible.value = uName;
                    reqFor.value = userID;
                    reqFor.onchange();
                    reqFor.setAttribute('aria-activedescendant', 'ac_option_' + userID);
                    assignedToVisible.value = uName;
                    assignedTo.value = userID;
                    assignedTo.onchange();
                    reqFor.blur();
                };
            };

            userAssign();

            function CreateButton(){
                var beforeNodeL = document.getElementsByClassName('vsplit col-sm-6')[3];
                var beforeNodeU = document.getElementsByClassName('vsplit col-sm-6')[1];
                var targetNodeT = document.getElementById('element.incident.assignment_group');
                var targetNodeWorkNotes = document.getElementsByClassName('sn-stream-textarea-container')[2].parentElement;
                var targetInfo = document.getElementById('incident.form_scroll');

                var lowerDiv = document.createElement('div');
                var upperDiv = document.createElement('div');
                var middleDiv = document.createElement('div');
                var workNotesDivOb = document.createElement('div');
                var workNotesDivCim = document.createElement('div');
                var infoDiv = document.createElement('div');

                var newNodeTran = document.createElement('span');
                var newNodeRfc = document.createElement('span');
                var newNodeReoc = document.createElement('span');
                var newNodeKB = document.createElement('span');
                var newNodeRFCend = document.createElement('span');
                var newNodeResolve = document.createElement('span');
                var newNodeObContact = document.createElement('span');
                var newNodeCimContact = document.createElement('span');
                var newNodeInfo = document.createElement('span');

                var textTran = document.createTextNode('Transfer');
                var textRfc = document.createTextNode('RFC check');
                var textReoc = document.createTextNode('Reoccurrence')
                var textKB = document.createTextNode('KB');
                var textRFCend = document.createTextNode('RFC end');
                var textResolve = document.createTextNode('Resolve');
                var textObContact = document.createTextNode('OB contacted RG');
                var textCimContact = document.createTextNode('CIM contacted RG');
                var textInfo = document.createTextNode('Shortcut Help');

                newNodeTran.setAttribute('id', 'TransferringTo');
                newNodeRfc.setAttribute('id', 'RFC');
                newNodeReoc.setAttribute('id', 'Reoccurrence')
                newNodeKB.setAttribute('id', 'KB_open');
                newNodeRFCend.setAttribute('id', 'RFCend');
                newNodeResolve.setAttribute('id', 'autoResolve');
                newNodeObContact.setAttribute('id', 'obContact');
                newNodeCimContact.setAttribute('id', 'cimContact');
                newNodeInfo.setAttribute('id', 'shortcutInfo');

                newNodeTran.style.color = "red";
                newNodeResolve.style.color = "red"
                lowerDiv.style.cssText = "margin-left: 312px; margin-bottom: 8px;";
                upperDiv.style.cssText = "margin-left: 312px; margin-bottom: 8px;";
                middleDiv.style.cssText = "margin-left: 312px; margin-bottom: 8px;";
                newNodeReoc.style.cssText = "color: red; position: relative; left: 50px;";
                newNodeKB.style.cssText = "color: red; position: relative; left: 25px;";
                newNodeRFCend.style.cssText = "color: red; position: relative; left: 25px";
                newNodeRfc.style.cssText = "color: red;";
                newNodeObContact.style.cssText = "color: red;";
                newNodeCimContact.style.cssText = "color: red";
                newNodeInfo.style.cssText = "color: red";

                newNodeTran.appendChild(textTran);
                newNodeRfc.appendChild(textRfc);
                newNodeReoc.appendChild(textReoc);
                newNodeKB.appendChild(textKB);
                newNodeRFCend.appendChild(textRFCend);
                newNodeResolve.appendChild(textResolve);
                newNodeObContact.appendChild(textObContact);
                newNodeCimContact.appendChild(textCimContact);
                newNodeInfo.appendChild(textInfo)

                beforeNodeL.insertBefore(lowerDiv, beforeNodeL.childNodes[9]);
                beforeNodeU.insertBefore(upperDiv, beforeNodeU.childNodes[7]);
                beforeNodeL.insertBefore(middleDiv, beforeNodeL.childNodes[5]);
                targetNodeWorkNotes.appendChild(workNotesDivOb);
                targetNodeWorkNotes.appendChild(workNotesDivCim);
                targetInfo.insertBefore(infoDiv, targetInfo.childNodes[0]);

                lowerDiv.appendChild(newNodeTran);
                upperDiv.appendChild(newNodeResolve);
                middleDiv.appendChild(newNodeRfc);
                upperDiv.appendChild(newNodeRFCend);
                upperDiv.appendChild(newNodeReoc);
                lowerDiv.appendChild(newNodeKB);
                workNotesDivOb.appendChild(newNodeObContact);
                workNotesDivCim.appendChild(newNodeCimContact);
                infoDiv.appendChild(newNodeInfo);
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
                document.getElementById('obContact').addEventListener('click', function(){Contact('Operations Bridge')}, false);
                document.getElementById('cimContact').addEventListener('click', function(){Contact('Critical Incident Manager')}, false);
                document.getElementById('shortcutInfo').addEventListener('click', shortcutInfo, false);
                //keyboard shortcuts
                //ALT+Q
                document.addEventListener('keydown', function(e){
                    if (e.keyCode == 81 && !e.shiftKey && !e.ctrlKey && e.altKey && !e.metaKey) {
                        RFC();
                    };
                }, false);
                //ALT+W
                document.addEventListener('keydown', function(e){
                    if (e.keyCode == 87 && !e.shiftKey && !e.ctrlKey && e.altKey && !e.metaKey) {
                        KB();
                    };
                }, false);
                //ALT+A
                document.addEventListener('keydown', function(e){
                    if (e.keyCode == 65 && !e.shiftKey && !e.ctrlKey && e.altKey && !e.metaKey) {
                        check(1);
                    };
                }, false);
                //ALT+D
                document.addEventListener('keydown', function(e){
                    if (e.keyCode == 68 && !e.shiftKey && !e.ctrlKey && e.altKey && !e.metaKey) {
                        check(2);
                    };
                }, false);
                console.log('ev ends');
                //ALT+C
                document.addEventListener('keydown', function(e){
                    if (e.keyCode == 67 && !e.shiftKey && !e.ctrlKey && e.altKey && !e.metaKey) {
                        incSave();
                    };
                }, false);
                console.log('ev ends');
            };

            function shortcutInfo(){
                alert('Press the following keys to run specified function:\n\nALT+Q - RFC check\nALT+W - KB\n\nALT+A - Resolve\nALT+D - RFC end\n\nALT+C - Save the incident (top right button)');
            };

            function incSave(){
                console.log('incSave');
                document.getElementById('incident.form_header').querySelector('#sysverb_update_and_stay').click();
            };

            function Contact(group){
                var RFCMESSAGE = GM_getValue('CONTACTMESSAGE');
                if(!RFCMESSAGE){
                    alert('[THIS IS ONE TIME MESSAGE]\n\nTreat "OK" as "YES" and "CANCEL" as "NO"');
                    GM_setValue('CONTACTMESSAGE', true);
                };
                if(confirm('Did the RG picked up?')){
                    pasteAndPush(group + ' contacted Resolving Group');
                    if(confirm('Will they investigate?')){
                        pasteAndPush(', they will investigate.')
                    } else {
                        pasteAndPush('.');
                    };
                } else {
                    pasteAndPush(group + ' tried to contact the Resolving Group, there was no response.');
                };
            };

            function transfer(){
                console.log('transfer start');
                var fromV = document.getElementById('sys_display.incident.assignment_group').value;
                var text = "Transferring to " +fromV + ".";
                console.log('before push');
                pasteAndPush(text);
                console.log('after push');
            };

            function RFC(){
                var RFCMESSAGE = GM_getValue('RFCMESSAGE');
                if(!RFCMESSAGE){
                    alert('[THIS IS ONE TIME MESSAGE]\n\nIn order for tihs function to work properly keep RFC site opened in one tab.\nThe best way would be to pin it.\n\nClick the "RFC check" button once again to run this function normally');
                    GM_setValue('RFCMESSAGE', true);
                } else {
                    var appServices = document.getElementById('sys_display.incident.cmdb_ci').value.toUpperCase();
                    var isDateOk = GM_getValue('isDateOk');
                    var labelsQuick = GM_getValue('labelsQuick');
                    var labelsFind = [];
                    var labelsArrPos = [];
                    var date = [];
                    var splittedArr = [];
                    console.log(labelsQuick);
                    GM_setValue('rfcTimeEnd', false);
                    GM_setValue('rfcNumber', false);
                    GM_setValue('isThereRfc', false);
                    GM_setValue('appServices', appServices);
                    GM_setValue('rfcReturn', false);
                    console.log(labelsQuick);
                    if(labelsQuick && typeof labelsQuick !== 'undefined'){
                        for(var i = 0; i < labelsQuick.length; i++){
                            labelsFind.push(labelsQuick[i][0][0].search(appServices));
                        };
                        labelsArrPos = valuesOtherThanMinusOne(labelsFind);
                        if(labelsArrPos.length !== 0){
                            GM_setValue('rfcSiteClose', false);
                            for(var j = 0; j < labelsArrPos.length; j++){
                                date.push(labelsQuick[labelsArrPos][1][0]);
                            };
                            arraySplit(date);
                            monitorRfc();
                        } else {
                            GM_setValue('labelsQuick', false);
                            GM_setValue('rfcNumberQuick', false);
                            RFC();
                        };
                    } else {
                        console.log('else');
                        if(!isDateOk){
                            alert("Date on the RFC site doesn't match current date.");
                        } else if(isDateOk){
                            var doesCalendarExist = GM_getValue('doesCalendarExist');
                            if(!doesCalendarExist){
                                alert('Wait until the RFC tables are loaded');
                            } else if(doesCalendarExist){
                                GM_setValue('rfcSiteClose', true);
                                GM_setValue('rfcSiteMonitoring', true);
                                monitorRfc();
                            };
                        };
                    };
                };
            };

            function valuesOtherThanMinusOne(arr){
                console.log('values');
                var i = 0
                var outputArr = [];
                while(i !== arr.length){
                    if(arr[i] !== -1){
                        outputArr.push(i);
                    };
                    i++
                };
                return outputArr;
            };

            function monitorRfc(){
                var rfcReturn = GM_getValue('rfcReturn');
                var rfcSiteClose = GM_getValue('rfcSiteClose');
                console.log(rfcReturn);
                if(!rfcReturn){
                    console.log('monitoring');
                    var monitor = setTimeout(monitorRfc, 1000);
                } else if (rfcReturn == 1 || rfcReturn == 2 || rfcReturn == 3) {
                    switch(rfcReturn){
                        case 1:
                            alert('There is no RFC for this server for today');
                            clearTimeout(monitor);
                            break;
                        case 2:
                            if(!rfcSiteClose){
                                alert('There is no RFC for this server right now');
                            };
                            clearTimeout(monitor);
                            break;
                        case 3:
                            RFCPaste();
                            clearTimeout(monitor);
                            break;
                    };
                };
            };

            function RFCPaste(){
                console.log('repeating');
                var rfcTimeEnd = GM_getValue('rfcTimeEnd');
                var rfcNumber = GM_getValue('rfcNumber');
                var rfcNumberQuick = GM_getValue('rfcNumberQuick');
                if(!(rfcTimeEnd && (rfcNumber || rfcNumberQuick))){
                    var timeoutPaste;
                    timeoutPaste = setTimeout(RFCPaste, 1000);
                } else {
                    console.log('CLEARING VALUES');
                    clearTimeout(timeoutPaste);
                    GM_setValue('rfcTimeEnd', false);
                    GM_setValue('rfcNumber', false);
                    var text = "RFC#" + rfcNumberQuick + "- closing incident on " + rfcTimeEnd + ".";
                    var final = document.getElementById('incident.assigned_to')
                    var finalDisplay = document.getElementById('sys_display.incident.assigned_to');
                    var userID = document.getElementById('add_me_locked.incident.watch_list').getAttribute('data-user-id');
                    var uName = document.getElementById('add_me_locked.incident.watch_list').getAttribute('data-user');
                    var incState = document.getElementById('incident.incident_state');
                    pasteAndPush(text);
                    finalDisplay.value = uName;
                    final.value = userID;
                    final.onchange();
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
                GM_setValue('copy', false);
                var target = document.getElementById('incident.em_alert.incident_table').getElementsByClassName('list2_body')[0].getElementsByClassName('linked')[3].innerHTML;
                //            if (target == null){
                //                alert('There is no KB article for this alert');
                //            } else {
                var windowWithKB = window.open('https://arcelormittalprod.service-now.com' + target, '_blank');
                //            };
                monitor();
            };

            function monitor(){
                console.log('monitoring');
                var ifCopy = GM_getValue('copy');
                var transferOnly = GM_getValue('transferOnly');
                if(!ifCopy){
                    var timeoutMonitor
                    timeoutMonitor = setTimeout(monitor, 200);
                    if(!transferOnly){
                        clearTimeout(timeoutMonitor);
                    };
                } else {
                    clearTimeout(timeoutMonitor);
                    monitorFocus();
                };
            };

            function monitorFocus(){
                if (!document.hasFocus()){
                    console.log('monitorFocus');
                    var monitorFocusTimeout = setTimeout(monitorFocus, 200);
                } else if (document.hasFocus()){
                    clearTimeout(monitorFocusTimeout);
                    RGPaste();
                };
            };

            function RGPaste(){
                var copy = GM_getValue('copy');
                console.log('RGPASTE');
                if(copy){
                    var RGpaste = GM_getValue('targetRG');
                    var text = "Transferring to " + RGpaste + ".";
                    var assignment = document.getElementById('sys_display.incident.assignment_group');
                    assignment.focus();
                    setTimeout(function(){
                        assignment.value = RGpaste;
                        pasteAndPush(text);
                        setTimeout(function(){
                            assignment.blur();
                        },200);
                    },200);
                } else {
                    console.log('KB other than transfer only');
                }
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

            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            function incStateFunc(){
                incState.value = 6;
                incState.onchange();
            };

            function incSubStateFunc(){
                incSubState.value = "Permanently Resolved";
                incSubState.onchange();
            };

            function incResCatFunc(){
                incResCat.value = "Application";
                incResCat.onchange();
            };

            function incSubCatFunc(){
                incSubCat.value = "Others";
                incSubCat.onchange();
            };

            function incClsNodFunc(){
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
                } else if(incSubCat.childElementCount > 30 && incSubCat.value !== "Others" && incClsNod.childElementCount !== 6){
                    incSubCat.onchange();
                    console.log("IncSubCat onchange");
                };
                //if lower than 100, onchange() on  incSubCatFunc() will not fire
                setTimeout(function(){
                    checker()
                }, 200);
            };

            function checker(){
                if(incState.value != 6 || incSubState.value !== "Permanently Resolved" || incResCat.value !== "Application" || incSubCat.value !== "Others" || incClsNod.value !== "Other"){
                    console.log('change');
                    change()
                } else {
                    console.log('RESOLVING DONE');
                    var tabs2 = document.getElementById('tabs2_section');
                    var dest = tabs2.childNodes[2].childNodes[0];
                    dest.click();
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

            //KNOWLEDGE BASE/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        } else if (document.URL.slice(0, 63) == "https://arcelormittalprod.service-now.com/kb_view.do?sys_kb_id="){
            console.log('AutoTransfer');
            function RGcopy(){
                var KBRG = document.getElementById('article').getElementsByTagName('p')[2];
                var start, end, RG;
                if(KBRG.textContent.slice(0,8) == "Transfer" && KBRG.childElementCount == 1){
                    start = KBRG.textContent.search('«');
                    end = KBRG.textContent.search('»');
                    RG = KBRG.textContent.slice(start+2, end-1);
                    if(RG == 'BD North – Infrastructure – Midrange SAP BC'){
                        RG = 'BD North - Infrastructure - Midrange SAP BC';
                        GM_setValue('targetRG', RG);
                        GM_setValue('copy', true)
                    } else if (RG == 'BD North - Applications Industrielles - AMAL - Dunkerque – GTS'){
                        RG = 'BD North - Applications Industrielles - AMAL - Dunkerque - GTS';
                        GM_setValue('targetRG', RG);
                        GM_setValue('copy', true)
                    } else {
                        GM_setValue('targetRG', RG);
                        GM_setValue('copy', true);
                    };
                    var leave = confirm('RG copied\nGo to the INC tab and click anywhere to gain tab-focus, to paste the RG\n\nOK - close tab\nCANCEL - stay on tab');
                    if (leave){
                        window.close();
                    };
                } else {
                    GM_setValue('transferOnly', false);
                };
            };
            RGcopy();
        };

        //RFC/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        if(document.URL.slice(0,45) == "http://web-expl.appliarmony.net/OSP/RFC/plann"){

            GM_setValue('rfcSiteMonitoring', false);
            GM_setValue('labelsQuick', false);
            GM_setValue('rfcNumberQuick', false);

            checkDate();

            function checkDate(){
                var siteDate = document.getElementById('startDate').value
                var nowDate = new Date();
                siteDate = new Date(siteDate);
                console.log('site date: ' + siteDate + '\nyour date: ' + nowDate);
                if(nowDate.getYear() == siteDate.getYear() && nowDate.getMonth() == siteDate.getMonth() && nowDate.getDate() == siteDate.getDate()){
                    checkIfCalendarPresent();
                    GM_setValue('isDateOk', true);
                    console.log(GM_getValue('isDateOk'));
                } else {
                    alert('Change "Start Date" to match current date and REFRESH the site');
                    GM_setValue('isDateOk', false);
                    console.log(GM_getValue('isDateOk'));
                };
            };

            function checkIfCalendarPresent(){
                var idCalendar = document.getElementById('calendar');
                if (idCalendar === null){
                    console.log('calendar doesnt exists');
                    GM_setValue('doesCalendarExist', false);
                    setTimeout(checkIfCalendarPresent, 300);
                } else {
                    GM_setValue('doesCalendarExist', true);
                    console.log('calendar exists')
                    rfcSiteMonitor();
                };
            };

            function rfcSiteMonitor(){
                var rfcSiteMonitoring = GM_getValue('rfcSiteMonitoring');
                if(!rfcSiteMonitoring){
                    console.log('monitoring');
                } else {
                    serverFind();
                };
                var monitor = setTimeout(rfcSiteMonitor,1000);
            };

            function serverFind(){
                GM_setValue('rfcSiteMonitoring', false);
                var serverName = GM_getValue('appServices');
                var br = document.getElementById('calendar').getElementsByTagName('td')[1].getElementsByTagName('br')
                var brLength = br.length;
                var numb = [];
                var i = 0;
                while( i != brLength){
                    numb.push(br[i].nextSibling.textContent.search(serverName));
                    i++;
                };
                console.log(numb);
                openWindow(numb);
            };

            function openWindow(numbCall){
                if(numbCall.some(el => el > -1)){
                    console.log('FOUND');
                    var numb = numbCall;
                    var rfcURLindex = numb.indexOf(Math.max(...numb));
                    console.log(rfcURLindex);
                    var rfcURL = document.getElementById('calendar').getElementsByTagName('td')[1].getElementsByTagName('a')[rfcURLindex].href;
                    window.open(rfcURL, '_blank');
                    GM_setValue('isThereRfc', true);
                } else {
                    console.log('setting rfcreturn');
                    GM_setValue('isThereRfc', false);
                    GM_setValue('rfcReturn', 1);
                    GM_setValue('rfcTimeEnd', false);
                    GM_setValue('rfcNumber', false);
                };
            };
        };


        if((document.URL.slice(0,45) == "http://web-expl.appliarmony.net/OSP/RFC/valid") && (GM_getValue('isThereRfc') === true)){
            console.log('after if');
            GM_setValue('isThereRfc', false);
            var currentDate = new Date();
            var counter = 0;
            var counter2 = 0;

            checkIfRfcListPresent();

            function checkIfRfcListPresent(){
                var iwoList = document.getElementById('iwoList').getElementsByTagName('div').length;
                if (iwoList <= 0){
                    console.log('RFC list not loaded');
                    setTimeout(checkIfRfcListPresent, 300);
                    iwoList = document.getElementById('iwoList').getElementsByTagName('div').length;
                } else if (iwoList > 0){
                    console.log('RFC list loaded');
                    getRfc();
                };
            };

            //Searches for Equipement(s) labels, finds next sibling (server names) and forwards data
            function getRfc(){
                console.log('get');
                var serverName = GM_getValue('appServices');
                var rfcNumber = document.URL.slice(-5)
                GM_setValue('rfcNumber', rfcNumber);
                var iwoList = document.getElementById('iwoList');
                var labels = iwoList.getElementsByTagName('label');
                var labelsLength = labels.length;
                var labelsNew = [];
                var labelsQuick1 = [];
                var labelsQuick2 = [];
                var labelsQuick = [];
                var k = 0;
                var j = 0;
                var i = 0;
                var oldArr = [];
                var arr = [];
                for(j = 3; j < labelsLength; j = j + 8){
                    labelsNew.push(labels[j]);
                    labelsQuick1.push(labelsNew[k].nextSibling.textContent);
                    labelsQuick2.push(labelsNew[k].nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.innerText);
                    labelsQuick.push([[labelsQuick1[k]], [labelsQuick2[k]], [rfcNumber]]);
                    k++;
                };
                while(i < labelsNew.length){
                    arr.push(labelsNew[i].nextSibling.textContent.search(serverName));
                    i++;
                };
                GM_setValue("labelsQuick", labelsQuick);
                GM_setValue("rfcNumberQuick", rfcNumber);
                console.log(arr);
                valuesOtherThanMinusOne(arr);
            };

            //Returns an array with position of server matches
            function valuesOtherThanMinusOne(arr){
                console.log('values');
                var i = 0
                var outputArr = [];
                while(i !== arr.length){
                    if(arr[i] !== -1){
                        outputArr.push(i);
                    };
                    i++
                };
                getLabelsWithDate(outputArr)
            };

            function getLabelsWithDate(outputArr){
                console.log('getL');
                var iwoList = document.getElementById('iwoList')
                var target = iwoList.getElementsByClassName('quoteDiv')
                var date = new Date();
                var year = date.getFullYear();
                var arr = []
                while(counter < outputArr.length){
                    var bTagCount = target[outputArr[counter]].getElementsByTagName('b').length
                    while(counter2 < bTagCount){
                        var dateText = target[outputArr[counter]].getElementsByTagName('b')[counter2].textContent;
                        if(dateText.slice(0,4) == year){
                            arr.push(dateText);
                        };
                        counter2++;
                    };
                    counter2 = 0;
                    counter++;
                };
                arraySplit(arr);
            };
        };
    } else {
        var runallTimeout = setTimeout(RUNALL, 300);
        runallTimeout;
    };
};
RUNALL();
