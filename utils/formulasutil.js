module.exports = {
    convertToMathjs: (formula) => {
        let mathjsform = formula.replace(/Math./g, '');
        return mathjsform;
    },

    calculate: (input, formula) => {
        let vars = '';
        let keyNames = Object.keys(input);
        keyNames.forEach(obj => {
            if (isNaN(input[obj])) {
                vars = vars + 'var ' + obj + '="' + input[obj] + '";\n';
            } else {
                vars = vars + 'var ' + obj + '=' + input[obj] + ';\n';
            }
        });

        global.logger.debug("vars -> " + input);
        vars = vars + formula;

        global.logger.debug("formula -> " + vars);
        return eval(vars);
    },

    calcpercentile: (percentileL, valpL, percentileH, valpH, val) => {
        let jumps = (Number(valpH) - Number(valpL)) / (Number(percentileH) - Number(percentileL));

        let percentil = Number(percentileL);
        let valPercentil = Number(valpL);
        //global.logger.debug('jumps '+jumps);
        //global.logger.debug(valPercentil +' '+ percentil+' '+ val);
        while (val >= valPercentil) {
            //global.logger.debug(valPercentil +' '+ percentil);
            valPercentil = valPercentil + jumps;
            percentil = percentil + 1;
            //global.logger.debug('new ' + valPercentil +' '+ percentil);
        }
        //global.logger.debug(percentileL +' '+ valpL +' '+ percentileH +' '+ valpH +' '+ val)
        return percentil;
    }
};
