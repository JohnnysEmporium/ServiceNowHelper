// ==UserScript==
// @name         ServiceNow Helper
// @namespace    https://github.com/JohnyHCL/ServiceNowHelper/raw/master/ServiceNowHelper.user.js
// @version      1.2
// @description  Adds a few features to the Service Now console.
// @author       Jan Sobczak
// @match        https://arcelormittalprod.service-now.com/*
// @downloadURL  https://github.com/JohnyHCL/ServiceNowHelper/raw/master/ServiceNowHelper.user.js
// @updateURL    https://github.com/JohnyHCL/ServiceNowHelper/raw/master/ServiceNowHelper.user.js
// @grant        none
// ==/UserScript==

'use strict';

var snMain = document.getElementById('dropzone1');
var snInc = document.getElementById('incident.form_header');


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
    function ATfunction(){
        function CreateButton(){
            var beforeNodeT = document.getElementsByClassName('vsplit col-sm-6')[3];
            var targetNodeT = document.getElementById('element.incident.assignment_group');
            var newDiv = document.createElement('div');
            var newNodeT = document.createElement('span');
            var newNodeR = document.createElement('span');
            var textT = document.createTextNode('Transfer');
            var textR = document.createTextNode('RFC');
            newDiv.setAttribute('id', 'newDiv');
            newNodeT.setAttribute('id', 'TransferringTo');
            newNodeR.setAttribute('id', 'RFC');
            newDiv.style.marginLeft = "312px";
            newDiv.style.marginBottom = "8px";
            newNodeR.style.position = "relative";
            newNodeR.style.left = "30px";
            newNodeR.style.color = "red";
            newNodeT.style.color = "red";
            newNodeT.appendChild(textT);
            newNodeR.appendChild(textR);
            beforeNodeT.insertBefore(newDiv, beforeNodeT.childNodes[9]);
            newDiv.appendChild(newNodeT);
            newDiv.appendChild(newNodeR);
            EvListener();
        };

        function EvListener(){
            var targetT = document.getElementById('TransferringTo');
            var targetR = document.getElementById('RFC');
            targetT.addEventListener('click', transfer, false);
            targetR.addEventListener('click', RFC, false);
        };

        function transfer(){
            var post = document.getElementsByClassName('btn btn-default pull-right activity-submit')[0];
            var fromV = document.getElementById('sys_display.incident.assignment_group').value;
            var toV1 = document.getElementById('activity-stream-textarea');
            var toV2 = document.getElementById('activity-stream-work_notes-textarea');
            var check = document.getElementById('activity-stream-work_notes-textarea').parentElement.parentElement.parentElement.parentElement.className
            if (check == 'ng-hide'){
                toV1.value += "Transferring to " + fromV + ".";
                angular.element(jQuery('#activity-stream-textarea')).triggerHandler('input')
            } else if (check == "") {
                toV2.value += "Transferring to " + fromV + ".";
                angular.element(jQuery('#activity-stream-work_notes-textarea')).triggerHandler('input')
            };
        };

        function RFC(){
            var toV1 = document.getElementById('activity-stream-textarea');
            var numb = window.prompt('Enter RFC number');
            var date = window.prompt('When the RFC ends?');
            toV1.value += "RFC" + numb + " closing incident at " + date;
            angular.element(jQuery('#activity-stream-textarea')).triggerHandler('input')
        };
        CreateButton();
    };
    ATfunction();
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    function ARfunction(){
        const incState = document.getElementById('incident.incident_state');
        const incSubState = document.getElementById('incident.u_sub_status');
        const incResCat = document.getElementById('incident.u_resolution_category');
        const incSubCat = document.getElementById('incident.u_resolution_sub_category');
        const incClsNod = document.getElementById('incident.close_code');
        var act = incState.value;
        var timer = setInterval(surveilence,500);
        var incClsNodChilds = incClsNod.childElementCount;
        var incSubCatChilds = incSubCat.childElementCount;
        var mandatory = incSubState.childElementCount


        function change1(){
            mandatory = incSubState.childElementCount;
            console.log(mandatory);
            if (incSubState.value !== "Permanently Resolved"){
                incSubState.value = "Permanently Resolved";
                incSubState.onchange();
                console.log("sub status changed")
            } else {
                console.log("sub status not changed")
            };
        };

        function change2(){
            incResCat.value = "Application";
            incResCat.onchange();
        };

        function change3(){
            incSubCatChilds = incSubCat.childElementCount;
            if(incSubCat.value !== "Others" && incSubCatChilds > 30){
                incSubCat.value = "Others";
                incSubCat.onchange();
                console.log("sub category changed");
            } else if(incSubCat.value == "Others"){
                return;
            } else {
                console.log("sub category not changed")
                setTimeout(function(){
                    change3();
                },50);
            };
        };

        function change4(){
            incClsNodChilds = incClsNod.childElementCount;
            if(incClsNod.value !== "Other" && incSubCat.value == "Others" ){
                incClsNod.value = "Other";
                incClsNod.onchange();
                console.log("resolution code changed")
            } else if(incClsNod.value == "Other"){
                return;
            } else {
                console.log("resolution code not changed")
                setTimeout(function(){
                    change4();
                },50);
            };
        };

        function surveilence(){
            if (incSubState.value !== "Permanently Resolved" || incSubCat.value !== "Others" || incClsNod.value !== "Other"){
                check();
            } else {
                console.log("clear interval");
                clearInterval(timer);
            };
        };

        function check(){
            console.log(act);
            if(incState.value == 6 && incState.value != act){
                if(incSubState.value !== "Permanently Resolved"){
                    change1();
                };
                change2();
                if(incSubCat.value !== "Others"){
                    change3();
                };
                if(incClsNod.value !== "Other"){
                    change4();
                };
            };
        };

    };
    ARfunction();
};
