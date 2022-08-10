const _app  = require('./app');

import { HelperClass } from './Class/HelperClass/helperClass';

_app.listen(3000, () =>{
    HelperClass.LoggerInfo('Server running on port 3000');
    console.log('Server running on port 3000');
});