var data=[];
$(function(){
    console.log("Ready!");
})

// ---- Classification ---- //
function clasQuestion(stnc) {
    if (stnc.indexOf("?")>=0) return true;
    return false
}
function classExclamatory(stnc) {
    if (stnc.indexOf("!")>=0) return true;
    return false
}
function clasNormal(stnc) {
    if (!clasQuestion(stnc)&&!classExclamatory(stnc)) return true;
    return false
}
function clasSimple(stnc) {
    if (!clasCompound(stnc)) return true;
    return false
}
function clasCompound(stnc) {
    if (stnc.indexOf("and")>=0||
        stnc.indexOf("or")>=0||
        stnc.indexOf(",")>=0) return true;
    return false
}

// ---- Parse Sentence ---- //
function parseSentence(s){
    if (s==null) return ;
    do{
        var period = s.indexOf(". ")==-1?s.length+1:s.indexOf(". "), 
        qMark = s.indexOf("? ")==-1?s.length+1:s.indexOf("? "), 
        exMark = s.indexOf("! ")==-1?s.length+1:s.indexOf("! ");

        var pos = Math.min(period,qMark,exMark);

        data.push(s.slice(0,pos+1));
        
        s=s.slice(pos+2);
        // console.log(s);
        // console.log(s.length);
    }while (s.length>0);

    return data;
}

// ---- Main ---- //
function classification(){
    let s = document.getElementById("input").value;
    parseSentence(s);
    let q=0,e=0,nrm=0,smp=0,cpd=0;
    if (data.length>0){
        for (var i=0;i<data.length;i++){
            if (clasQuestion(data[i])) q++;
            if (classExclamatory(data[i])) e++;
            if (clasNormal(data[i])) nrm++;
            if (clasSimple(data[i])) smp++;
            if (clasCompound(data[i])) cpd++;  
        }
    }
    alert("Has: "+q+" Question.\n"+e+" Exclamatory.\n"+nrm+" Normal Sentence.\n"+smp+" Simple Sentence.\n"+cpd+" Compound Sentence.\n");
}
function onchangeHandle(elm){
    console.log(elm.value);
}

