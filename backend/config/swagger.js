import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'API documentation cho hệ thống quản lý sân bóng',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
    tags: [
      { name: 'Auth Customer', description: 'API xác thực khách hàng' },
      { name: 'Auth Field Owner', description: 'API xác thực chủ sân' },
      { name: 'Field Management', description: 'API quản lý sân bóng' },
      { name: 'Tournament', description: 'API quản lý giải đấu' },
      { name: 'Team', description: 'API quản lý đội bóng' },
      { name: 'Booking', description: 'API đặt sân' },
      { name: 'Rating', description: 'API đánh giá sân' },
      { name: 'Notification', description: 'API thông báo' },
      { name: 'Profile', description: 'API thông tin cá nhân' }
    ],
    components: {
      schemas: {
        Customer: {
          type: 'object',
          properties: {
            username: { type: 'string' },
            fullname: { type: 'string' },
            email: { type: 'string' },
            phone_no: { type: 'string' }
          }
        },
        Field: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            address: { type: 'string' },
            base_price: { type: 'number' },
            total_grounds: { type: 'number' },
            grounds: { 
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  ground_number: { type: 'number' },
                  status: { type: 'boolean' }
                }
              }
            }
          }
        },
        Tournament: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            type: { type: 'string' },
            team_limit: { type: 'number' },
            start_date: { type: 'string', format: 'date' },
            end_date: { type: 'string', format: 'date' }
          }
        }
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      },
      responses: {
        UnauthorizedError: {
          description: 'Access token is missing or invalid'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ],
  },
  apis: ['./backend/routes/*.js', './backend/controller/*.js'],
};

export const specs = swaggerJsdoc(options); 