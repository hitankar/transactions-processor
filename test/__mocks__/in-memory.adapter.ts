
const mock = jest.fn().mockImplementation(() => {
  return {
    get: jest.fn().mockImplementation((key: string) => []),
    set: jest.fn()
  };
});

export default mock;