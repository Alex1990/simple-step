step
====

A simple jQuery plugin to show a step-by-step layer.

Usage
-----

You can see the examples for the details. And, you should pay attention to the HTML structure.

Packages
--------

You can use [npm](https://github.com/npm/npm) or [bower](http://bower.io) to install it.

**NPM**

```bash
npm install simple-step
```

**Bower**

```bash
bower install simple-step
```

Options
-------

- **effect**

  Type:`String` Default:`'none'`

  The switching effect. Only `'none'` and `'slide'`(horizontally) are supported.

- **duration**

  Type:`Number` Default:`350`

  The effect duration. The unit is millisecond.`

- **startAt**

  Type:`Number` Default:`0`

  The index (zero-based) of the initial step.

- **showCancel**

  Type:`Boolean` Default:`true`

  Whether to show the "Cancel" button.

- **showPrev**

  Type:`Boolean` Default:`true`

  Whether to show the "Previous" button, which is hidden on the first step.

- **showNext**

  Type:`Boolean` Default:`true`

  Whether to show the "Next" button, which is hidden on the last step.

- **showFinish**

  Type:`Boolean` Default:`false`

  Whether to show the "Finish" button on every step. But, it's always shown on the last step.

- **activeCls**

  Type:`String` Default:`'active'`

  The current step.

- **activatedCls**

  Type:`String` Default:`'activated'`

  The steps in front of the current step.

- **onprev**

  Type:`Function` Default:`Empty function`

  After switching to the previous step, this callback will be called. The current index will be passed as the first argument.

- **onnext**

  Type:`Function` Default:`Empty function`

  After switching to the next step, this callback will be called. The current index will be passed as the first argument.

- **oncancel**

  Type:`Function` Default:`Empty function`

  When trigger the "Cancel" button, this callback will be called. The current index will be passed as the first argument.

- **onfinish**

  Type:`Function` Default:`Empty function`

  When trigger the "Finish" button, this callback will be called. The current index will be passed as the first argument.

- **onbeforeprev**

  Type:`Function` Default:`Empty function`

  This callback will be called before switching to the previous step. The current index will be passed as the first argument.

- **onbeforenext**

  Type:`Function` Default:`Empty function`

  This callback will be called before switching to the next step. The current index will be passed as the first argument.

License
-------

Under the MIT license.
