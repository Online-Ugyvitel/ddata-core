/* eslint-disable jasmine/no-disabled-tests */
import 'zone.js/testing';

// This is an abstract class test file
// Since DataServiceAbstract is abstract, we don't need to test it directly
// The concrete implementations will be tested in their respective spec files

xdescribe('DataServiceAbstract', () => {
  it('should be an abstract class', () => {
    // This test is disabled as DataServiceAbstract is abstract
    expect(true).toBe(true);
  });
});
