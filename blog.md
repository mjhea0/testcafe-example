# Functional Testing with TestCafe

Today we are going to dive into the world of functional web testing with [TestCafe](https://devexpress.github.io/testcafe/).

Unlike the majority of other tools, TestCafe is not dependent on Selenium or WebDriver. It works on any modern browser that supports HTML5 without any plugins. Further, it supports all major operating systems and can run simultaneously on multiple browsers and machines.

We will be using:

- TestCafe v[0.13.0](https://github.com/DevExpress/testcafe/releases/tag/v0.13.0)
- Chrome v[57](https://chromereleases.googleblog.com/2017/03/stable-channel-update-for-desktop.html)
- Firefox v[52](https://www.mozilla.org/en-US/firefox/52.0/releasenotes/)
- NodeJS v[7.6.0](https://nodejs.org/docs/v7.6.0/api/all.html)

Please review the [Getting Started](http://devexpress.github.io/testcafe/documentation/getting-started/) guide before beginning.

## Contents

1. Objectives
1. Project Setup
1. Tests
1. Browser Support
1. Continuous Integration
1. Next Steps

## Objectives

By the end of this tutorial, you should be able to...

1. foo
1. bar

## Project Setup

Start by cloning the base project structure:

```sh
$ git clone https://github.com/mjhea0/testcafe-example --branch v1 --single-branch -b master
```

Install the dependencies, and then fire up the app by running `npm start` to make sure all is well. Navigate to [http://localhost:3000/](http://localhost:3000/) in your browser and you should see a list of jobs in HTML. Experiment with the app. Add a job. Update a job. Delete a job. This is what we will be testing. Kill the server when done.

Install TestCafe:

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
  const repo = Selector('.repo-list > li > div');
  // search github
  await t
    .typeText('form[action="/search"]', 'testcafe-example user:mjhea0')
    .pressKey('enter');
  // check li for results
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

> **NOTE:** If you're new to [async/await](https://github.com/tc39/ecmascript-asyncawait), check out [Understanding JavaScript’s async await](https://ponyfoo.com/articles/understanding-javascript-async-await).

Try this out! Run `npm test`. If all goes well Chrome should fire up and execute the test. Once done, you should see something like this in your terminal:

```sh
Running tests in:
- Chrome 57.0.2987 / Mac OS X 10.11.6

Getting Started
✓ Find "testcafe-example" repo on GitHub
```

Make sense? No? Continue to run the test and review the above steps until it does. Make sure you understand what's happening before moving on.

Let's test our app...

## Tests

Add a new file called *jobs.js* to the "tests" folder:

```javascript
import { Selector } from 'testcafe';

fixture('Node Jobs')
  .page('http://localhost:3000');

test('All Jobs', async (t) => {

});
```

Then update the `test` command in *package.json*:

```json
"test": "node_modules/testcafe/bin/testcafe.js chrome tests/jobs.js --app 'npm start'"
```

`tests/jobs.js` ignores *index.js* so that we can focus just on the tests added to *jobs.js*. The `--app` [option](https://devexpress.github.io/testcafe/documentation/using-testcafe/command-line-interface.html#-a-command---app-command) is used to launch the app.

Try it. You should see the page load in Chrome. With that, let's test each of our app's CRUD functions.

### GET ALL Jobs

Update *jobs.js*:

```javascript
import { Selector } from 'testcafe';

fixture('Node Jobs')
  .page('http://localhost:3000');

test('All Jobs', async (t) => {
  const title = Selector('h1');
  const tableRows = Selector('tbody > tr');
  const addJobButton = Selector('a.btn.btn-primary');
  const firstJob = Selector('tbody > tr').withText('Horse Whisperer');
  // check title, add job button, table rows, and job exists
  await t
    .expect(title.innerText).eql('All Jobs')
    .expect(addJobButton.innerText).eql('Add New Job')
    .expect(tableRows.count).eql(3)
    .expect(firstJob.exists).ok();
});
```

What's happening? Turn to the [docs](https://devexpress.github.io/testcafe/documentation/test-api/selecting-page-elements/) to figure this out on your own, adding comments as necessary.

Run:

```sh
Node Jobs
✓ All Jobs


1 passed (0s)
```

Before moving on, refactor out the selectors so that they can be re-used by other test cases:

```javascript
import { Selector } from 'testcafe';

// selectors
const title = Selector('h1');
const tableRows = Selector('tbody > tr');
const addJobButton = Selector('a.btn.btn-primary');
const firstJob = Selector('tbody > tr').withText('Horse Whisperer');

fixture('Node Jobs')
  .page('http://localhost:3000');

test('All Jobs', async (t) => {
  // check title, add job button, table rows, and job exists
  await t
    .expect(title.innerText).eql('All Jobs')
    .expect(addJobButton.innerText).eql('Add New Job')
    .expect(tableRows.count).eql(3)
    .expect(firstJob.exists).ok();
});
```

### Add Job

Start by adding a new `test()` function to *jobs.js*:

```javascript
test.only('New Job', async (t) => {

});
```

> **NOTE:** Can you guess what `only()` does? Try running the tests to see. Please review the [docs](https://devexpress.github.io/testcafe/documentation/test-api/test-code-structure.html#skipping-tests) for more info.

Think about the steps an end user has to go through to add a job:

1. Click the add job button
1. Fill out the form
1. Submit the form

Now, try this on your own, step by step, before looking at the solution...

```javascript
test.only('New Job', async (t) => {
  // click add job button
  await t
    .click(addJobButton)
    .expect(title.innerText).eql('Add Job');
  // fill out form
  await t
    .typeText('input[name="title"]', 'Python Developer')
    .typeText('textarea[name="description"]', 'Write some Python')
    .typeText('input[name="company"]', 'Real Python')
    .typeText('input[name="email"]', 'michael@realpython.com')
    .click(submitButton)
  // check title, table rows, and new job exists
  await t
    .expect(title.innerText).eql('All Jobs')
    .expect(tableRows.count).eql(4)
    .expect(Selector('tbody > tr').withText('Python Developer').exists).ok();
});
```

Make sure to add the selector to the top:

```javascript
const submitButton = Selector('button[type="submit"]');
```

Test it out. Then remove the `only()` and test again:

```sh
Node Jobs
✓ All Jobs
✓ New Job


2 passed (4s)
```

What are we missing in this test?

1. What happens if the cancel button is pressed?
1. What if the end user does not enter data for all the fields?
1. What if text is entered in the email field but it is not a valid email?

Try testing for these on your own.

### Update Job

Again, start by adding the boilerplate:

```javascript
test('Update Job', async (t) => {

});
```

Then write out the steps the end user has to take before writing any code:

1. Click the update button
1. Fill out the form
1. Submit the form

```javascript
test('Update Job', async (t) => {
  // click update button
  await t
    .click(firstJob.find('a.btn.btn-warning'))
    .expect(title.innerText).eql('Update Job');
  // fill out form
  await t
    .typeText('input[name="title"]', 'testing an update', {replace: true})
    .typeText('textarea[name="description"]', 'test', {replace: true})
    .typeText('input[name="company"]', 'test', {replace: true})
    .typeText('input[name="email"]', 't@t.com', {replace: true})
    .click(submitButton)
  // check title, table rows, and updated job exists
  await t
    .expect(title.innerText).eql('All Jobs')
    .expect(tableRows.count).eql(4) // why 4?
    .expect(firstJob.exists).notOk()
    .expect(Selector('tbody > tr').withText('testing an update').exists).ok();
});
```

Test:

```sh
Node Jobs
✓ All Jobs
✓ New Job
✓ Update Job


3 passed (8s)
```

What else should you test for? Write the test cases on your own.

Also, did you notice the code smell? There's a lot of code duplication happening between those last two test cases. How could this be better handled?

Finally, did you notice that there are still four jobs in the table? Why? Could there be issues with testing the previous two tests together rather than in isolation? Probably not in this case, but if there are, you could always wrap the update in a new `fixture()`, since this restores the page to its initial state.

### Delete Job

Run the app again with `npm start` to review, from the end user's perspective, what happens when you try to delete a job.

```javascript
test('Delete Job', async (t) => {
  // click delete button
  await t
    .setNativeDialogHandler(() => true)
    .click(clayDryerJob.find('a.btn.btn-danger'))
  // check title, table rows, and updated job exists
  await t
    .expect(title.innerText).eql('All Jobs')
    .expect(tableRows.count).eql(3) // why 3?
    .expect(clayDryerJob.exists).notOk();
});
```

Did you notice the `setNativeDialogHandler()` function? [This](https://devexpress.github.io/testcafe/documentation/test-api/handling-native-dialogs.html#dialog-handler) tells TestCafe how to handle the alert.

What if we click "cancel" instead of "ok"?


```javascript
test('Delete Job', async (t) => {
  // click delete button
  await t
    .setNativeDialogHandler(() => true) // => press ok
    .click(clayDryerJob.find('a.btn.btn-danger'))
  // check title, table rows, and updated job exists
  await t
    .expect(title.innerText).eql('All Jobs')
    .expect(tableRows.count).eql(3) // why 3?
    .expect(clayDryerJob.exists).notOk();
    // click delete button
  await t
    .setNativeDialogHandler(() => false) // => press cancel
    .click(tableRows.find('a.btn.btn-danger'))
  // check title, table rows, and updated job exists
  await t
    .expect(title.innerText).eql('All Jobs')
    .expect(tableRows.count).eql(3) // why 3?
});
```

Run the tests:

```sh
Node Jobs
✓ All Jobs
✓ New Job
✓ Update Job
✓ Delete Job


4 passed (9s)
```

Again, handle any edge cases on you own and clean up the code smell.

## Browser Support

Aside for Chrome, TestCafe [supports](https://devexpress.github.io/testcafe/documentation/using-testcafe/common-concepts/browser-support.html#officially-supported-browsers) a number of browsers out-of-the-box. If you don't need to test browser-dependent functionality, then you can use a headless browser.

Start by installing the [plugin](https://github.com/ryx/testcafe-browser-provider-nightmare), which is powered by [Nightmare](https://github.com/segmentio/nightmare):

```sh
$ npm install testcafe-browser-provider-nightmare@0.0.4 --save-dev
```

Update the `test` command in *package.json*:

```json
"test": "node_modules/testcafe/bin/testcafe.js nightmare tests/jobs.js --app 'npm start'"
```

Run the tests, and you should see:

```sh
Running tests in:
- Electron 1.6.2 / Mac OS X 10.11.6

Node Jobs
✓ All Jobs
✓ New Job
✓ Update Job
✓ Delete Job


4 passed (9s)
```

There's also a [plugin](https://github.com/DevExpress/testcafe-browser-provider-saucelabs) for cross browser support powered by [SauceLabs](https://saucelabs.com/).

## Continuous Integration

Finally, let's incorporate TestCafe into our Continuous Integration (CI) process with [Travis CI](https://travis-ci.org/).

> **NOTE:** New to Travis? Review the [Travis CI for Complete Beginners](https://docs.travis-ci.com/user/for-beginners) guide along with [Running Tests in Firefox and Chrome Using Travis CI](http://devexpress.github.io/testcafe/documentation/recipes/running-tests-in-firefox-and-chrome-using-travis-ci.html).

After you enable Travis CI for the repository you are working with, add a *.travis.yml* file to the project root:

```
language: node_js
node_js: "7"

before_install:
  - stty cols 80

dist: trusty
sudo: required

addons:
  apt:
    sources:
     - google-chrome
    packages:
     - google-chrome-stable

before_script:
  - "export DISPLAY=:99.0"
  - "sh -e /etc/init.d/xvfb start"
  - sleep 3
```

ADD EXPLANATION

## Next Steps

ADD NEXT STEPS
