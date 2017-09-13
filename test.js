var test = require('tape');
const jsonata = require('./jsonata');
const framework = require('./framework');
const _ = require('lodash');

var schema = {
    properties:{
        name:{
            properties:{
                test:{},
                name:{}
            }
        },
        aa:{}
    }
}
var frm = framework(schema);

test('Should accept path from schema', function(assert){
  try{
    var expression = jsonata(`aa`,frm);
    assert.pass("Path Accepted") ;
  } catch(error){
    assert.fail("Path Not accepted");
  } finally{
    assert.end();
  }
});

test('Should not accept path not from schema', function(assert){
  try{
    var expression = jsonata(`bb`,frm);
    assert.fail("Path Accepted") ;
  } catch(error){
    assert.pass("Path Not accepted");
  } finally{
    assert.end();
  }
});

test('Should throw error with proposal missing path', function(assert){
  try{
    var expression = jsonata(`aa.`,frm);
    assert.fail("Incomplete Path Accepted") ;
  } catch(error){
    assert.deepEqual(error.proposals, ["name","aa"],"Has proposals");
    
  } finally{
    assert.end();
  }
});
test('Should throw error with attribute proposal', function(assert){
  try{
    var expression = jsonata(`aa[`,frm);
    assert.fail("Incomplete Path Accepted") ;
  } catch(error){
    assert.deepEqual(error.proposals, ["name","aa"],"Has proposals");
    
  } finally{
    assert.end();
  }
});
test('Should throw error with operator proposal', function(assert){
  try{
    var expression = jsonata(`aa[name`,frm);
    assert.fail("Incomplete Path Accepted") ;
  } catch(error){
    assert.deepEqual(error.proposals, ["=",">", "<"],"Has proposals");
    
  } finally{
    assert.end();
  }
});
test('Should throw error with attrib and const proposal', function(assert){
  try{
    var expression = jsonata(`aa[name=`,frm);
    assert.fail("Incomplete Path Accepted") ;
  } catch(error){
    assert.deepEqual(error.proposals, ["name","aa", "<const>"],"Has proposals");
    
  } finally{
    assert.end();
  }
});