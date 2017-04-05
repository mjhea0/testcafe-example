process.env.NODE_ENV = 'test';

const Selector = require('testcafe').Selector;
const chai = require('chai');

const should = chai.should();

// selectors
const title = Selector('h1');
const tableRows = Selector('tbody > tr');
const addJobButton = Selector('a.btn.btn-primary');
const firstJob = Selector('tbody > tr').withText('Horse Whisperer');
const submitButton = Selector('button[type="submit"]');
const clayDryerJob = Selector('tbody > tr').withText('Clay Dryer');

describe('mherman.org', () => {

  describe('Jobs Resource', () => {
    fixture('Jobs Resource').page('http://localhost:3333');
      it('should list ALL jobs on /jobs GET', (done) => {
        test('All Jobs', async (t) => {
          // check title, add job button, table rows, and job exists
          await t
            .expect(title.innerText).eql('All Jobs')
            .expect(addJobButton.innerText).eql('Add New Job')
            .expect(tableRows.count).eql(3)
            .expect(firstJob.exists).ok();
          done();
        });
      });
      it('should list a SINGLE job on /job/<id> GET');
      it('should add a SINGLE job on /jobs POST');
      it('should update a SINGLE job on /job/<id> PUT');
      it('should delete a SINGLE job on /job/<id> DELETE');

  });

});
