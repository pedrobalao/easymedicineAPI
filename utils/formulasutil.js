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
    }
  };
  