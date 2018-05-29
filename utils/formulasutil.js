module.exports = {
    convertToMathjs: function (formula) {
        let mathjsform = formula.replace(/Math./g, '');
        return mathjsform;
    },
    calculate: function(input, formula){
        var vars = '';
        var keyNames = Object.keys(input);
        keyNames.forEach(obj => {
            vars = vars + 'var '+obj+'="'+input[obj]+'";\n'; 
        });
        // JSON.stringify(keyNames);
        vars = vars + formula;
        return eval(vars);
    }
  };
  