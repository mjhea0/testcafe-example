import { Selector } from 'testcafe';

// selectors
const title = Selector('h1');
const tableRows = Selector('tbody > tr');
const addJobButton = Selector('a.btn.btn-primary');
const firstJob = Selector('tbody > tr').withText('Horse Whisperer');
const submitButton = Selector('button[type="submit"]');
const clayDryerJob = Selector('tbody > tr').withText('Clay Dryer');

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

test('New Job', async (t) => {
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
