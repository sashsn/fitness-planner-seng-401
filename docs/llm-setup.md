# LMStudio Setup for Fitness Planner

This guide will help you set up LMStudio to work with the Fitness Planner application.

## Prerequisites

- LMStudio installed on your machine (https://lmstudio.ai/)
- Fitness Planner application properly set up

## Setup Steps

1. **Launch LMStudio**
   
   Open LMStudio application on your computer.

2. **Load a Model**
   
   You need to load a model before using the API. In LMStudio:
   
   - Click on the "Library" tab in the left sidebar
   - Browse through available models (we recommend a Mistral or Llama model)
   - Click "Download" next to a model you want to use
   - Once downloaded, click "Load" to activate the model

3. **Start the API Server**
   
   - In LMStudio, click on "Developer" in the left sidebar
   - In the "Inference Server" section, click "Start Server"
   - The server will start on `http://localhost:1234` by default
   - Make sure it shows "Server running" in green text

4. **Configure Environment Variables**
   
   Update your `.env` file to include:
   ```
   LLM_API_URL=http://localhost:1234/v1/chat/completions
   ```

5. **Test the Connection**
   
   Run the test script to verify LMStudio is correctly set up:
   