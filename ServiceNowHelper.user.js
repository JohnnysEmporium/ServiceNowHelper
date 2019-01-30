// ==UserScript==
// @name         ServiceNow Helper
// @namespace    https://github.com/JohnyHCL/ServiceNowHelper/raw/master/ServiceNowHelper.user.js
// @version      1.7.7
// @description  Adds a few features to the Service Now console.
// @author       Jan Sobczak
// @match        https://arcelormittalprod.service-now.com/*
// @match        http://web-expl.appliarmony.net/OSP/RFC/*
// @downloadURL  https://github.com/JohnyHCL/ServiceNowHelper/raw/master/ServiceNowHelper.user.js
// @updateURL    https://github.com/JohnyHCL/ServiceNowHelper/raw/master/ServiceNowHelper.user.js
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

'use strict';


function RUNALL(){

    if(document.readyState === 'complete'){

        clearTimeout(runallTimeout);
        console.log('runall clear timeout');
        var snMain = document.getElementById('dropzone1');
        var snInc = document.getElementById('incident.form_header');
        var bodyCount = document.body.childElementCount;

        //SNOW MAIN/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
                    //            setInterval(function(){
                    ad.play();
                    //            }, 500);
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

            function userAssign(){
                var reqForVisible = document.getElementById('sys_display.incident.u_requested_for');
                if(reqForVisible.value == ""){
                    console.log('Assign User START');
                    var userID = document.getElementById('add_me_locked.incident.watch_list').getAttribute('data-user-id');
                    var uName = document.getElementById('add_me_locked.incident.watch_list').getAttribute('data-user');
                    var reqFor = document.getElementById('incident.u_requested_for');
                    //var assignedTo = document.getElementById('incident.assigned_to')
                    //var assignedToVisible = document.getElementById('sys_display.incident.assigned_to');
                    reqForVisible.value = uName;
                    reqFor.value = userID;
                    reqFor.onchange();
                    reqFor.setAttribute('aria-activedescendant', 'ac_option_' + userID);
                    //assignedToVisible.value = uName;
                    //assignedTo.value = userID;
                    //assignedTo.onchange();
                    //  reqFor.blur();
                    console.log('end');
                };
            };

            userAssign();

            function CreateButton(){
                var beforeNodeL = document.getElementsByClassName('vsplit col-sm-6')[3];
                var beforeNodeU = document.getElementsByClassName('vsplit col-sm-6')[1];
                var targetNodeT = document.getElementById('element.incident.assignment_group');
                var lowerDiv = document.createElement('div');
                var upperDiv = document.createElement('div');
                var middleDiv = document.createElement('div');
                var newNodeTran = document.createElement('span');
                var newNodeRfc = document.createElement('span');
                var newNodeReoc = document.createElement('span');
                var newNodeKB = document.createElement('span');
                var newNodeRFCend = document.createElement('span');
                var newNodeResolve = document.createElement('span');
                //        var newNodeRFCPaste = document.createElement('span');
                var textTran = document.createTextNode('Transfer');
                var textRfc = document.createTextNode('RFC check');
                var textReoc = document.createTextNode('Reoccurrence')
                var textKB = document.createTextNode('KB');
                var textRFCend = document.createTextNode('RFC end');
                var textResolve = document.createTextNode('Resolve');
                var textRFCPaste = document.createTextNode('RFC Paste');
                newNodeTran.setAttribute('id', 'TransferringTo');
                newNodeRfc.setAttribute('id', 'RFC');
                newNodeReoc.setAttribute('id', 'Reoccurrence')
                newNodeKB.setAttribute('id', 'KB_open');
                newNodeRFCend.setAttribute('id', 'RFCend');
                newNodeResolve.setAttribute('id', 'autoResolve');
                //        newNodeRFCPaste.setAttribute('id', 'RFCPaste');
                newNodeTran.style.color = "red";
                newNodeResolve.style.color = "red"
                lowerDiv.style.cssText = "margin-left: 312px; margin-bottom: 8px;";
                upperDiv.style.cssText = "margin-left: 312px; margin-bottom: 8px;";
                middleDiv.style.cssText = "margin-left: 312px; margin-bottom: 8px;";
                newNodeReoc.style.cssText = "color: red; position: relative; left: 50px;";
                newNodeKB.style.cssText = "color: red; position: relative; left: 25px;";
                newNodeRFCend.style.cssText = "color: red; position: relative; left: 25px";
                newNodeRfc.style.cssText = "position: relative; left:; color: red;";
                //        newNodeRFCPaste.style.cssText = "position: relative; left: 25px; color: red;";
                newNodeTran.appendChild(textTran);
                newNodeRfc.appendChild(textRfc);
                newNodeReoc.appendChild(textReoc);
                newNodeKB.appendChild(textKB);
                newNodeRFCend.appendChild(textRFCend);
                newNodeResolve.appendChild(textResolve);
                //        newNodeRFCPaste.appendChild(textRFCPaste);
                beforeNodeL.insertBefore(lowerDiv, beforeNodeL.childNodes[9]);
                beforeNodeU.insertBefore(upperDiv, beforeNodeU.childNodes[7]);
                beforeNodeL.insertBefore(middleDiv, beforeNodeL.childNodes[5]);
                lowerDiv.appendChild(newNodeTran);
                upperDiv.appendChild(newNodeResolve);
                middleDiv.appendChild(newNodeRfc);
                //        middleDiv.appendChild(newNodeRFCPaste);
                upperDiv.appendChild(newNodeRFCend);
                upperDiv.appendChild(newNodeReoc);
                lowerDiv.appendChild(newNodeKB);
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
                //        document.getElementById('RFCPaste').addEventListener('click', RFCPaste, false);
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
                GM_setValue('rfcTimeEnd', null);
                GM_setValue('rfcNumber', null);
                GM_setValue('isThereRfc', null);
                var appServices = document.getElementById('sys_display.incident.cmdb_ci').value.toUpperCase();
                GM_setValue('appServices', appServices);
                GM_setValue('appServices1', appServices);
                GM_setValue('appServices2', appServices);
                window.open('http://web-expl.appliarmony.net/OSP/RFC/planning.asp?p=week&t=all&v=eqpt#', '_blank');
                RFCPaste();
            };

            function RFCPaste(){
                console.log('repeating');
                var rfcTimeEnd = GM_getValue('rfcTimeEnd');
                var rfcNumber = GM_getValue('rfcNumber');
                console.log(rfcTimeEnd, rfcNumber);
                if(rfcTimeEnd === null || rfcNumber === null){
                    var timeoutPaste;
                    timeoutPaste = setTimeout(RFCPaste, 1000);
                    // if ((rfcTimeEnd && rfcNumber))
                } else{
                    clearTimeout(timeoutPaste);
                    GM_setValue('rfcTimeEnd', null);
                    GM_setValue('rfcNumber', null);
                    var text = "RFC#" + rfcNumber + "- closing incident on " + rfcTimeEnd + ".";
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
                window.open('https://arcelormittalprod.service-now.com' + target, '_blank');
                //            };
                monitor();
            };

            function monitor(){
                console.log('monitoring');
                var ifCopy = GM_getValue('copy');
                if(!ifCopy){
                    var timeoutMonitor
                    timeoutMonitor = setTimeout(monitor, 200);
                } else {
                    clearTimeout(timeoutMonitor);
                    RGPaste();
                };
            };

            function RGPaste(){
                var copy = GM_getValue('copy');
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
                if(KBRG.textContent.slice(0,24) == "Transfer the incident to" && KBRG.childElementCount == 1){
                    start = KBRG.textContent.search('«');
                    end = KBRG.textContent.search('»');
                    RG = KBRG.textContent.slice(start+2, end-1);
                    GM_setValue('targetRG', RG);
                    GM_setValue('copy', true);
                    window.close();
                };
            };
            RGcopy();
        };

        //RFC/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        var serverNameCheck1 = GM_getValue('appServices1');
        var serverNameCheck2 = GM_getValue('appServices2');
        var serverName = GM_getValue('appServices');
        console.log(serverNameCheck1);

        if((document.URL == 'http://web-expl.appliarmony.net/OSP/RFC/planning.asp?p=week&t=all&v=eqpt#') && (serverNameCheck1 != false)){
            GM_setValue('appServices1', false);
            var dat = new Date();
            var onSiteDate = document.getElementById('startDate').value;
            var todaysDate = dat.getFullYear() + "-" + dat.getMonth() + 1 + "-" + dat.getDate()
            var hour = dat.getHours();
            var minute = dat.getMinutes();
            //        if(hour >= 0 && hour <= 6){
            //            todaysDate = dat.getFullYear() + "-" + dat.getMonth() + 1 + "-" + (dat.getDate() - 1)
            if(onSiteDate == todaysDate){
                checkIfCalendarPresent();
                console.log('IFFFFFFFFFFF');
            } else {
                alert('Date is not correct\nchange it and refresh the site');
            };
            //        };

            function checkIfCalendarPresent(){
                var idCalendar = document.getElementById('calendar');
                if (idCalendar === null){
                    console.log('calendar doesnt exists');
                    setTimeout(checkIfCalendarPresent, 300);
                    idCalendar = document.getElementById('calendar')
                } else {
                    console.log('calendar exists')
                    var br = document.getElementById('calendar').getElementsByTagName('td')[1].getElementsByTagName('br')
                    var brLength = br.length - 1;
                    serverFind(br, brLength, serverName);
                };
            };

            function serverFind(brCall, brLengthCall, serverName){
                var numb = [];
                var i = 0;
                while( i != brLengthCall){
                    numb.push(brCall[i].nextSibling.textContent.search(serverName));
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
                    window.close();
                } else {
                    var serverName = GM_getValue('appServices');
                    GM_setValue('isThereRfc', false);
                    GM_setValue('appServices', false);
                    GM_setValue('rfcTimeEnd', false);
                    GM_setValue('rfcNumber', false);
                    alert('There is no RFC for ' + serverName);
                    window.close();
                };
            };
        };

        if((document.URL.slice(0,-5) == "http://web-expl.appliarmony.net/OSP/RFC/valid.asp?ref=") && (serverNameCheck2 != false)){
            console.log('after if');
            serverNameCheck2 = false;
            GM_setValue('appServices2', false);
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

            function getRfc(){
                console.log('get');
                var iwoList = document.getElementById('iwoList');
                var labels = iwoList.getElementsByTagName('label');
                var labelsLength = labels.length;
                var labelsNew = []
                var j = 0;
                var i = 0;
                var oldArr = [];
                var arr = [];
                for(j = 3; j < labelsLength; j = j + 8){
                    labelsNew.push(labels[j]);
                };
                while(i < labelsNew.length){
                    arr.push(labelsNew[i].nextSibling.textContent.search(serverName));
                    i++;
                };
                valuesOtherThanMinusOne(arr);
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

            function arraySplit(arr){
                console.log('arr');
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
                var endDate = [];
                var someDate = new Date();
                var i = 0;
                var j = 0;
                while(i < length){
                    startDate.push(new Date(arr[i][0]));
                    if(arr[i][1].length > 7){
                        endDate.push(new Date(arr[i][1]));
                    } else {
                        if(arr[i][1].length == 4){
                            endDate.push(new Date((someDate).setHours(arr[i][1].slice(0,1),(arr[i][1].slice(-2)))));
                        } else {
                            endDate.push(new Date((someDate).setHours(arr[i][1].slice(0,2),(arr[i][1].slice(-2)))));
                        };
                    };
                    i++
                };
                checkTime(startDate, endDate);
            };

            function checkTime(sD, eD){
                console.log('check');
                console.log(eD);
                var i = 0;
                var cD = currentDate;
                var threshold = 3*60*60*1000;
                var ifFound;
                while(i < sD.length){
               //     if(eD && eD.constructor === Array && eD.length === 0){

                 //   } else {
                        if(cD > sD[i] && cD < eD[i]){
                            alert('RFC found, the data has been pasted in Work Notes field');
                            console.log('RFC found, value to paste stored');
                            storeValue(eD[i]);
                            ifFound = true;
                            break;
                        } else if(cD > (sD[i].getTime() - threshold) && cD < (eD[i].getTime() + threshold)){
                            alert('RFC is going to start or has already ended (time range is 30 minutes)\nDespite that, value has been stored and pasted into the Work Notes field');
                            storeValue(eD[i]);
                            ifFound = true;
                            break;
                        };
                        i++;
              //      };
                };
                if(!ifFound){
                    alert('There is no RFC for ' + serverName + '\nBetter luck next time')
                };
                window.close();
            };

            function storeValue(eT){
                var endTime = eT;
                var zeroOrNot = eT.getMinutes();
                var endTimeToPaste
                if(String(eT.getMinutes()).length == 1){
                    endTimeToPaste = eT.getFullYear() + '-' + eT.getMonth() + 1 + '-' + eT.getDate() + ' at ' + eT.getHours() + ':' + eT.getMinutes() + '0';
                } else {
                    endTimeToPaste = eT.getFullYear() + '-' + eT.getMonth() + 1 + '-' + eT.getDate() + ' at ' + eT.getHours() + ':' + eT.getMinutes();
                };
                var rfcNumber = document.URL.slice(-5);
                GM_setValue('rfcNumber', rfcNumber);
                GM_setValue('rfcTimeEnd', endTimeToPaste);
                window.close();
            };
        };
    } else {
        var runallTimeout = setTimeout(RUNALL, 300);
        runallTimeout;
    };
};
RUNALL();
