/**
 * User Service unit tests
 */
const userService = require('../../../services/userService');
const { User } = require('../../../models');
const { ApiError } = require('../../../utils/errors');

// Mock Sequelize models
jest.mock('../../../models', () => {
  const mockUser = {
    findOne: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    comparePassword: jest.fn()
  };
  
  mockUser.prototype.comparePassword = jest.fn();
  mockUser.prototype.update = jest.fn();
  mockUser.prototype.destroy = jest.fn();
  
  return {
    User: mockUser
  };
});

describe('User Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      // Setup
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };
      
      const mockCreatedUser = {
        id: '123',
        username: 'testuser',
        email: 'test@example.com',
        get: () => ({
          id: '123',
          username: 'testuser',
          email: 'test@example.com',
          password: 'hashedpassword'
        })
      };
      
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue(mockCreatedUser);
      
      // Execute
      const result = await userService.createUser(userData);
      
      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ where: { email: userData.email } });
      expect(User.create).toHaveBeenCalledWith(userData);
      expect(result.user).toBeDefined();
      expect(result.token).toBeDefined();
    });

    it('should throw an error if user with email already exists', async () => {
      // Setup
      const userData = {
        username: 'testuser',
        email: 'existing@example.com',
        password: 'password123'
      };
      
      User.findOne.mockResolvedValue({ id: '456', email: 'existing@example.com' });
      
      // Execute & Assert
      await expect(userService.createUser(userData)).rejects.toThrow(ApiError);
    });
  });

  // Additional tests would follow here
});
