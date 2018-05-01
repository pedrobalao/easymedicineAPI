module.exports = {
    convertToMathjs: function (formula) {
        let mathjsform = formula.replace(/Math./g, '');
        return mathjsform;
    }
  };
  