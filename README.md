# easymedicineAPI (legacy)
easyped API

[![Build Status](https://pedrochavs.visualstudio.com/easypedapi/_apis/build/status/pedrobalao.easymedicineAPI%20(1)?branchName=master)](https://pedrochavs.visualstudio.com/easypedapi/_build/latest?definitionId=15&branchName=master)

[![Deploy Status](https://pedrochavs.vsrm.visualstudio.com/_apis/public/Release/badge/2370742a-6115-4c81-9c9d-4f1d64bcfdb7/1/1)](https://pedrochavs.visualstudio.com/easypedapi/_build/latest?definitionId=15&branchName=master)

## Configuration
1. `mkdir config`
1. `cd config`
1. `cat > secrets.js`

```javascript
var secrets = {
  db:{
    config: {
      user: 'USER',
      password: 'PASSWORD',
      host: 'HOST',
      database: 'DB',
      ssl: true
    }
  }
};

module.exports = secrets;
```

