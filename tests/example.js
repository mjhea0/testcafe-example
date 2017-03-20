import { Selector } from 'testcafe';

fixture('TestCafe Example')
  .page('http://mherman.org/testcafe-example');

test('slides', async (t) => {
  // check slide 1
  await t
    .expect(Selector('h1').innerText).eql('End-to-End Testing with TestCafe');
  // move through slides
  await t
    .pressKey('right')
    .wait(1000)
    .pressKey('right')
    .wait(1000)
    .pressKey('right')
    .wait(1000)
    .pressKey('right')
    .wait(1000)
    .pressKey('right')
    .wait(1000)
    .takeScreenshot();
});
