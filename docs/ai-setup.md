# OpenAI API Setup for Fitness Planner

This guide will help you set up the OpenAI API to work with the Fitness Planner application.

## Using the OpenAI API

The application is now configured to use the OpenAI API instead of LM Studio. This provides more reliable AI-powered workout plan generation.

### Configuration

The OpenAI API key is already configured in the application. However, for production deployments, you should set it as an environment variable:

1. Create or update your `.env` file with:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

2. Make sure not to commit the API key to version control.

### Testing the Connection

After setting up your environment variables, you can test the connection:

```bash
npm run test:api
```

This command will verify that the application can successfully connect to the OpenAI API.

### Troubleshooting

- **API Rate Limits**: OpenAI has rate limits that might affect usage. If you encounter rate limit errors, consider implementing a retry mechanism or queue system.
- **API Key Issues**: Ensure your API key is valid and has the appropriate permissions.
- **Network Connectivity**: Make sure your server can access the OpenAI API endpoints.

## Using the AI Workout Generator

With the OpenAI API properly configured, users can now access the AI-powered workout generation feature through the application's interface.

1. Navigate to the Workout Plans section
2. Click "Generate New Plan"
3. Fill in your preferences
4. The application will use OpenAI to create a customized workout plan
