// import * as sinon from 'sinon';
// import { StateModel } from '../client/config/state';
// import { setupTestBridge, test } from '../client/config/bridge';

// var CircularJSON = require('circular-json')

// var c = require('chai-match-snapshot').config;
// c.serializer = (obj: any) => CircularJSON.stringify(obj, null, 2);

// describe('Test', function() {
//   let state: StateModel;
//   beforeEach(() => {
//     state = new StateModel(null);
//     sinon.stub(state.testQueue, 'add');

//     setupTestBridge(state, test);
//   });

//   function test1() {
//     describeTest('First', () => {
//       describeTest('One', () => {
//         itTest('TestOne', () => {  
//         });
//         itTest('TestTwo', () => {  
//         });
//       });
//       describeTest('Two', () => {
//         itTest('TestThree', () => {  
//         });
//       });
//     });
//     describeTest('First', () => {
//       describeTest('Three', () => {
//         itTest('TestThree', () => {  
//         });
//       });
//     });
//     describeTest('First', () => {
//       describeTest('Three', () => {
//         itTest('TestFour', () => {  
//         });
//       });
//     });
//     describeTest('Second', () => {
//     });
//   }

//   function test2() {
//     describeTest('First', () => {
//       describeTest('Two', () => {
//         itTest('TestEight', () => {  
//         });
//         describeTest('Six', () => {
//           itTest('TestNine', () => {  
//           });
//         });
//       });
//     });
//     describeTest('Second', () => {
//       describeTest('Seven', () => {
//       });
//     });
//   }
  
//   it('creates folder-like structure from describes', async function() {
//     test1();
    
//     state.updateRoot.name.should.equal('update');
//     state.updateRoot.groups.length.should.equal(2);

//     const group1 = state.updateRoot.groups[0];
//     group1.name.should.equal('First');
//     group1.groups[0].name.should.equal('One');
//     group1.groups[0].tests[0].name.should.equal('TestOne');
//     group1.groups[0].tests[1].name.should.equal('TestTwo');
//     group1.groups[0].path.should.equal('First > One');

//     const group2 = state.updateRoot.groups[1];
//     group2.parent.should.equal(state.updateRoot);

//     state.updateRoot.should.matchSnapshot();

//     await state.isReconciled();

//     const group2Live = state.liveRoot.groups[1];
//     group2Live.parent.should.equal(state.liveRoot);

//     state.liveRoot.should.matchSnapshot();
//     state.updateRoot.groups.length.should.equal(0);
//     state.updateRoot.tests.length.should.equal(0);

//     state.testQueue.add.should.have.callCount(2);

//     // run it again and test whether new parts are added

//     test1();
//     test2();

//     // console.log(CircularJSON.stringify(state.updateRoot, null, 2));

//     await state.isReconciled();

//     const li = CircularJSON.stringify(state.liveRoot, null, 2);

//     state.liveRoot.should.matchSnapshot();

//     test2();
//     await state.isReconciled();

//     state.liveRoot.should.matchSnapshot();
//   });
// });