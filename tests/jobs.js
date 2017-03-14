import { Selector } from 'testcafe';

fixture('Node Jobs')
  .page('http://localhost:3000');

test('All Jobs', async (t) => {
  const title = Selector('h1');
  const tableRows = Selector('tbody > tr');
  const addJobButton = Selector('a.btn.btn-primary');
  const firstJob = Selector('tbody > tr').withText('Horse Whisperer')
  // check title, add job button, table rows, and job exists
  await t
    .expect(title.innerText).contains('All Jobs')
    .expect(addJobButton.innerText).contains('Add New Job')
    .expect(tableRows.count).eql(3)
    .expect(firstJob.exists).ok();
});
