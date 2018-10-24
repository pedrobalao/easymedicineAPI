module.exports = {
    convertToMathjs: function (formula) {
        let mathjsform = formula.replace(/Math./g, '');
        return mathjsform;
    },
    calculate: function(input, formula){
        var vars = '';
        var keyNames = Object.keys(input);
        keyNames.forEach(obj => {
            if (isNaN(input[obj])) {
                vars = vars + 'var '+obj+'="'+input[obj]+'";\n'; 
            } else {
                vars = vars + 'var '+obj+'='+input[obj]+';\n'; 
            }
        });
        
        console.log("vars -> "+input);
        vars = vars + formula;

        console.log("formula -> "+vars);
        return eval(vars);
    },
    calcpercentile: function (percentileL, valpL, percentileH, valpH, val ) {
        let jumps = (Number(valpH) - Number(valpL))/(Number(percentileH) - Number(percentileL));
        
        let percentil = Number(percentileL);
        let valPercentil = Number(valpL);
        //console.log('jumps '+jumps);
        //console.log(valPercentil +' '+ percentil+' '+ val);
        while (val >= valPercentil) {
            //console.log(valPercentil +' '+ percentil);
            valPercentil = valPercentil + jumps;
            percentil = percentil + 1;
            //console.log('new ' + valPercentil +' '+ percentil);
        }
        //console.log(percentileL +' '+ valpL +' '+ percentileH +' '+ valpH +' '+ val)
        return percentil;
    }
  };
  