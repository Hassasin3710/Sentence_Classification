$(function(){
    console.log("Ready!");
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
})

// ---- Classification ---- //
function classQuestion(stnc) {
    if (stnc.indexOf("?")>=0) return true;
    return false
}
function classExclamatory(stnc) {
    if (stnc.indexOf("!")>=0) return true;
    return false
}
function classNormal(stnc) {
    if (!classQuestion(stnc)&&!classExclamatory(stnc)) return true;
    return false
}
function classSimple(stnc) {
    if (!classCompound(stnc)) return true;
    return false
}
function classCompound(stnc) {
    if (stnc.indexOf("and")>=0||
        stnc.indexOf("or")>=0||
        stnc.indexOf(",")>=0) return true;
    return false
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
    var q = [],e = [],nrm = [],smp = [],cpd = [];
    if (data.length>0){
        for (var i=0;i<data.length;i++){
            if (classSimple(data[i])) smp.push(data[i]);
            if (classCompound(data[i])) cpd.push(data[i]);  
            if (classQuestion(data[i])) q.push(data[i]);
            if (classExclamatory(data[i])) e.push(data[i]);
            if (classNormal(data[i])) nrm.push(data[i]);
        }
        pushContent("sentence",data);
        pushContent("simple",smp);
        pushContent("compound", cpd);
        pushContent("question", q);
        pushContent("exclamatory",e);
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
