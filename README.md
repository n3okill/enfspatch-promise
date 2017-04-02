[![Build Status](https://travis-ci.org/n3okill/enfspatch-promise.svg)](https://travis-ci.org/n3okill/enfspatch-promise)
[![AppVeyour status](https://ci.appveyor.com/api/projects/status/hqcy30ki773s6rbw?svg=true)](https://ci.appveyor.com/project/n3okill/enfspatch-promise)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/f2c315ec874a4703998eadf1bf6b585c)](https://www.codacy.com/app/n3okill/enfspatch-promise)
[![Donate](https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=64PYTCDH5UNZ6)

[![NPM](https://nodei.co/npm/enfspatch-promise.png)](https://nodei.co/npm/enfspatch-promise/)

enfspatch-promise
=================
Additional methods and patches for node fs module

**enfs** stands for [E]asy [N]ode [fs]

This module is intended to work as a sub-module of [enfs](https://www.npmjs.com/package/enfs-promise)


Description
-----------
This module is just a wrapper for [enfspath](https://www.npmjs.com/package/enfspath) to enable the use of promises.
  
Usage
-----
`enfspatch-promise` is a drop-in replacement for native `fs` module, you just need to include
it instead of the native module.

Use this
```js
    const enfs = require("enfspatch-promise");
```

All async methods finish with 'P', example:
open => openP

```js
    enfs.openP("/path","flags").then(function(fd){
        console.log(fd);
    });
```

instead of

```js
    const fs = require("fs"); //You don't need to do this anymore
```

and all the methods from native fs module are available fir use with promises

Errors
------
All the methods follows the node culture.
- Async: Every async method returns an Error in the first callback parameter
- Sync: Every sync method throws an Error.


License
-------

Creative Commons Attribution 4.0 International License

Copyright (c) 2017 Joao Parreira <joaofrparreira@gmail.com> [GitHub](https://github.com/n3okill)

This work is licensed under the Creative Commons Attribution 4.0 International License. 
To view a copy of this license, visit [CC-BY-4.0](http://creativecommons.org/licenses/by/4.0/).


