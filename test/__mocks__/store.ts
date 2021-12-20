const mock = jest.fn().mockImplementation(() => {
  return {
    append: jest.fn(),
    getAll: jest.fn(),
  };
});

export default mock;
