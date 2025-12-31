# Security Configuration

## Environment Variables

This project uses environment variables to store sensitive credentials. **Never commit the `.env` file to version control.**

### Setup Instructions

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Fill in your actual credentials in `.env`:
   - `VITE_RECLAIM_APP_ID`: Your Reclaim Protocol Application ID
   - `VITE_RECLAIM_APP_SECRET`: Your Reclaim Protocol Application Secret
   - `VITE_DISCORD_WEBHOOK_URL`: Your Discord webhook URL for notifications

3. The `.env` file is already listed in `.gitignore` and will not be committed to GitHub.

### For GitHub Submission

- Only `.env.example` should be committed (with placeholder values)
- The actual `.env` file with real credentials stays local
- Reviewers should create their own `.env` file using `.env.example` as a template

### Security Best Practices

- **Never hardcode credentials** in source files
- **Never commit `.env`** to version control
- **Rotate credentials** if accidentally exposed
- For production deployments, use secure secret management services
