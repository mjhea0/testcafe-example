# Functional Testing with TestCafe

Today we are going to dive into the world of functional web testing with [TestCafe](https://devexpress.github.io/testcafe/).

Unlike the majority of other tools, TestCafe is not dependent on Selenium or WebDriver. It works on any modern browser that supports HTML5 without any plugins. Further, it supports all major operating systems and can run simultaneously on multiple browsers and machines.

> **NOTE:** This tutorial uses TestCafe version [0.13.0](https://github.com/DevExpress/testcafe/releases/tag/v0.13.0).

Please review the [Getting Started](http://devexpress.github.io/testcafe/documentation/getting-started/) guide before beginning.

## Objectives

By the end of this tutorial, you should be able to...

1. foo
1. bar

## Getting Started

Start by cloning the base project structure:

```sh
$ git clone https://github.com/mjhea0/testcafe-example --branch v1 --single-branch -b master
```

Install the dependencies, and then fire up the app by running `npm start` to make sure all is well. Navigate to [http://localhost:3000/](http://localhost:3000/) in your browser and you should see a list of jobs in HTML.

Kill the server, and then install TestCafe:

```sh
$ npm install testcafe@0.13.0 --save-dev
```

With that, you can start running tests.

> **NOTE:** If you were using a Selenium-based testing tool you would need to install both Selenium and Web Driver, which can be difficult depending on your system setup.

Add a `test` command to the `scripts` in *package.json*:

```json
"scripts": {
  "start": "node ./bin/www",
  "test": "node_modules/testcafe/bin/testcafe.js chrome tests/"
},
```

Here, we specified the path to TestCafe in our "node_modules" folder along with a [target browser](http://devexpress.github.io/testcafe/documentation/using-testcafe/command-line-interface.html#browser-list), `chrome`, and [path](http://devexpress.github.io/testcafe/documentation/using-testcafe/command-line-interface.html#file-pathglob-pattern) to where all tests will be located, `tests/`.

Now, you can use `npm test` to run TestCafe. First, add a "tests" folder to the project root, and add an *index.js* file to it:

```javascript
import { Selector } from 'testcafe';

fixture('Getting Started')
  .page('https://github.com');

test('Find "testcafe-example" repo on GitHub', async (t) => {
  // search github
  await t
    .typeText('form[action="/search"]', 'testcafe-example user:mjhea0')
    .pressKey('enter');
  // check li for results
  const repo = await Selector('.repo-list > li > div');
  await t
    .expect(repo.innerText).contains('mjhea0/testcafe-example');
});
```

What's happening?

1. Since *all* tests are organized into [fictures](http://devexpress.github.io/testcafe/documentation/test-api/test-code-structure.html#fixtures), we started with a `fixture()` function.
1. From there we specified the start URL - `http://devexpress.github.io/testcafe/example` - via the `page()` [method](http://devexpress.github.io/testcafe/documentation/test-api/test-code-structure.html#specifying-the-start-webpage).
1. Next, we added the test code into a `test()` [function](http://devexpress.github.io/testcafe/documentation/test-api/test-code-structure.html#tests), which takes an async function along with the [test controller](http://devexpress.github.io/testcafe/documentation/test-api/actions/) object.
1. `await` is then used to wait for certain [actions](http://devexpress.github.io/testcafe/documentation/test-api/actions/) to complete. In this case, we used `typeText()` and `pressKey()` to search GitHub.
1. On the GitHub search results page, we used a `Selector()` [function](http://devexpress.github.io/testcafe/documentation/test-api/selecting-page-elements/selectors.html) to parse the DOM.
1. Finally, we asserted that the actual results contain the expected results.  

Try this out! Run `npm test`. If all goes well Chrome should fire up and execute the test. Once done, you should see something like this in your terminal:

```sh
Running tests in:
- Chrome 56.0.2924 / Mac OS X 10.11.6

Getting Started
✓ Find "testcafe-example" repo on GitHub
```

Make sense? No? Continue to run the test and review the above steps until it does. Make sure you understand what's happening before moving on.

## Tests

Let's test each of our app's CRUD functions...

### GET ALL Jobs




## CI
