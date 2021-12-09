var verbs=[], searchRslt;
$(function(){
    // ---- Expand ---- //
    var coll = document.getElementsByClassName("collapsible");
    for (var i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.maxHeight){
            content.style.maxHeight = null;
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
        }
        });
    }

    fetch ("https://raw.githubusercontent.com/monolithpl/verb.forms.dictionary/master/json/verbs-all.json")
        .then(function (resp) {
            return resp.json();
        })
        .then(function (data) {
            verbs=data;
            //console.log(data);
        })
    
    console.log("Ready!");
})

// ---- Classification ---- //
function matchExact(s,ve) {
    const v = new RegExp("\\b"+ve+"\\b");
    if (s.search(v)!=-1)  return true;
    return false;
}

function searchVerbs(stnc) {
    let rslt=0;
    for (var i=0;i<verbs.length;i++){
        for (var j=0;j<verbs[i].length;j++){
            if (matchExact(stnc,verbs[i][j])) {
                rslt+=1;
                console.log(verbs[i][j]);
            }
        }
    }
    return rslt;
}

function classNormal(stnc) {
    if (!classSimple(stnc) &&
    !classCompound(stnc) &&
    !classComplex(stnc) &&
    !classCompComp(stnc)) return true;
    return false;
}
function classSimple(stnc) {
    if (stnc.indexOf("and") < 0 &&
        stnc.indexOf("or") < 0 &&
        stnc.indexOf(",") < 0) return true;
        // var a = new RegExp("\\b"+verbs[2][2]+"\\b");
        // console.log("You're abashed me".search(a));
    if (searchRslt<=1) return true;
    return false;
}
function classCompound(stnc) {
    let fanboys = ['for', 'and', 'nor', 'but', 'or', 'yet', 'so', ','];
    for (let i = 0; i < fanboys.length; i++) {
        if (matchExact(stnc,fanboys[i])) {
            if (searchRslt>=2) return true;
        }
    }
    return false;
}
function classComplex(stnc) {
    let cmplx = ['after', 'although', 'as', 'as if', 'as long as', 'as much as', 'as soon as', 'as though', 'because', 'before', 'even if', 'even though', 'if', 'in case', 'once', 'since', 'so that', 'that', 'though', 'unless', 'until', 'when', 'whenever', 'whereas', 'where', 'wherever', 'while'];
    for (let i = 0; i < cmplx.length; i++) {
        if (stnc.indexOf(cmplx[i])) {
            if (searchRslt>=2) return true;
        }
    }
    return false;
}
//Compound-complex
function classCompComp(stnc) {
    let cmplx = ['after', 'although', 'as', 'as if', 'as long as', 'as much as', 'as soon as', 'as though', 'because', 'before', 'even if', 'even though', 'if', 'in case', 'once', 'since', 'so that', 'that', 'though', 'unless', 'until', 'when', 'whenever', 'whereas', 'where', 'wherever', 'while'];
    for (let i = 0; i < cmplx.length; i++) {
        if (stnc.indexOf(cmplx[i])) {
            if (searchRslt>=3) return true;
        }
    }
    return false;
}
// ---- Parse Sentence ---- //
function parseSentence(s){
    if (s==null) return ;
    var rlt=[];
    do{
        var period = s.indexOf(". ")==-1?s.length+1:s.indexOf(". "), 
        qMark = s.indexOf("? ")==-1?s.length+1:s.indexOf("? "), 
        exMark = s.indexOf("! ")==-1?s.length+1:s.indexOf("! ");
        var pos = Math.min(period,qMark,exMark);
        rlt.push(s.slice(0,pos+1));
        s=s.slice(pos+2);
        // console.log(s);
        // console.log(s.length);
    }while (s.length>0);

    return rlt;
}

// ---- Main ---- //
function classification(){
    let s = document.getElementById("input").value;
    var data = parseSentence(s);
    var cpx = [],cmp = [],nrm = [],smp = [],cpd = [];
    if (data.length>0){
        for (var i=0;i<data.length;i++){
            searchRslt = searchVerbs(data[i]);
            console.log(searchRslt);
            if (classSimple(data[i])) smp.push(data[i]);
            if (classCompound(data[i])) cpd.push(data[i]);  
            if (classComplex(data[i])) cpx.push(data[i]);
            if (classCompComp(data[i])) cmp.push(data[i]);
            if (classNormal(data[i])) nrm.push(data[i]);
        }
        pushContent("sentence",data);
        pushContent("simple",smp);
        pushContent("compound", cpd);
        pushContent("complex", cpx);
        pushContent("compcomp",cmp);
        pushContent("normal", nrm);
    }
    // alert("Has: "+q+" Question.\n"+e+" Exclamatory.\n"+nrm+" Normal Sentence.\n"+smp+" Simple Sentence.\n"+cpd+" Compound Sentence.\n");
    // document.getElementById("sentence").innerHTML=data.length;
    // document.getElementById("simple").innerHTML=smp;
    // document.getElementById("compound").innerHTML=cpd;
    // document.getElementById("question").innerHTML=q;
    // document.getElementById("exclamatory").innerHTML=e;
    // document.getElementById("normal").innerHTML=nrm;
    
}
function onchangeHandle(elm){
    console.log(elm.value);
}
// ---- Some Shit ---- //
function pushContent(id,data) {
    let el=document.getElementById(id);
    if (el==null) return;
    pushNumber(el,data.length);
    pushText(el,data);
}
function pushText(el,data) {
    let childEl=el.getElementsByClassName("insideContent")[0].childNodes[1];
    for (let i = 0; i < data.length; i++) {
        childEl.innerHTML+=data[i]+"<br>";
    }
}
function pushNumber(el, number) {
    let childEl=el.getElementsByClassName("bigNumber")[0];
    let begin=0, end=number;
    var interval= setInterval(function() {
        if (begin==end) clearInterval(interval);
        childEl.innerHTML=begin++;
    },100);
}
