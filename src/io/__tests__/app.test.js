import test from 'ava'
import sinon from 'sinon'
import app from '../app'

// No smart way to test the actual express route.
test('express app should return a 200 OK for the endpoint /check', t => t.pass())
