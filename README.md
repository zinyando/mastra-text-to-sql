# Mastra Text-to-SQL Application

A powerful application that converts natural language questions into SQL queries and displays results about city population data. Built with Next.js and PostgreSQL.

## Features

- **Natural Language to SQL**: Ask questions in plain English and get SQL queries and results
- **Complete Database View**: View all city population data in a formatted table
- **Dark Mode Support**: Professional UI with both light and dark mode
- **Example Queries**: Pre-built example queries to help users get started
- **Formatted Results**: Numbers displayed with thousands separators for better readability

## Technology Stack

- **Frontend**: Next.js with TypeScript and Tailwind CSS
- **Database**: PostgreSQL (hosted on Supabase)
- **AI**: Mastra AI for natural language processing
- **API**: RESTful API endpoints for data access

## Getting Started

### Prerequisites

- Node.js (v20 or newer)
- PostgreSQL database (local or remote)

### Environment Setup

Create a `.env` file in the root directory with the following variables:

```
OPENAI_API_KEY=your_openai_api_key

# Database Configuration
PGHOST=your_database_host
PGPORT=5432
PGUSER=your_database_user
PGPASSWORD=your_database_password
PGDATABASE=your_database_name
```

### Installation

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Usage

1. **Ask Questions**: Type a natural language question about city populations in the search box
2. **View Results**: See the generated SQL query and the results in a formatted table
3. **View Database**: Click on "View Database" in the header to see all city population data
4. **Try Examples**: Click on any example query to see how it works

## Database Schema

The application uses a `cities` table with the following structure:

- `id`: Unique identifier (hidden from view)
- `city`: City name
- `country`: Country name
- `continent`: Continent name
- `population`: Population count
- Additional demographic information

## Connection Pooling

The application uses connection pooling for efficient database access, with the following configuration:

- Maximum connections: 20
- Idle timeout: 30 seconds
- Connection timeout: 2 seconds

## Deployment

This application can be deployed on any platform that supports Next.js applications, such as Vercel or Netlify. Make sure to set up the environment variables in your deployment platform.
