import {Application} from 'express';
import * as request from 'supertest';
import {ApiServer} from '../../src/server';
import {Scope} from 'typescript-ioc';
import {HelloWorldApi} from '../../src/services';
import {buildApiServer} from '../helper';

class MockHelloWorldService implements HelloWorldApi {
  greeting = jest.fn().mockName('greeting');
}

describe('Hello controller', () => {

  let app: Application;
  let mockGreeting: jest.Mock;

  beforeEach(() => {
    const apiServer = buildApiServer();

    app = apiServer.getApp();

    apiServer.bind(HelloWorldApi).scope(Scope.Singleton).to(MockHelloWorldService);

    const mockService: HelloWorldApi = apiServer.get(HelloWorldApi);
    mockGreeting = mockService.greeting as jest.Mock;
  });

  test('canary validates test infrastructure', () => {
    expect(true).toBe(true);
  });

  describe('Given /hello', () => {
    const expectedResponse = 'Hello there!';

    beforeEach(() => {
      mockGreeting.mockReturnValueOnce(Promise.resolve(expectedResponse));
    });

    test('should return "Hello, World!"', done => {
      request(app).get('/hello').expect(200).expect(expectedResponse, done);
    });
  });

  describe('Given /hello/Johnny', () => {
    const name = 'Johnny';

    beforeEach(() => {
      mockGreeting.mockImplementation(name => name);
    });

    test('should return "Hello, Johnny!"', done => {
      request(app).get(`/hello/${name}`).expect(200).expect(name, done);
    });
  });

});
