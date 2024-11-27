# Deployment Guide

This document outlines the deployment process for the Kusina Amadeo website.

## Prerequisites

- Node.js 16.8 or later
- PostgreSQL database
- Vercel account (for production deployment)
- Environment variables configured

## Environment Setup

Create a `.env` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/kusina_amadeo"

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Image Upload
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# API Keys
GOOGLE_MAPS_API_KEY="your-google-maps-key"
```

## Local Development

1. Install dependencies:
```bash
npm install
# or
yarn install
```

2. Run database migrations:
```bash
npx prisma migrate dev
```

3. Start development server:
```bash
npm run dev
# or
yarn dev
```

## Production Build

1. Build the application:
```bash
npm run build
# or
yarn build
```

2. Start production server:
```bash
npm start
# or
yarn start
```

## Database Migration

### Development
```bash
# Generate migration
npx prisma migrate dev --name migration_name

# Reset database
npx prisma migrate reset

# View database
npx prisma studio
```

### Production
```bash
# Deploy migrations
npx prisma migrate deploy
```

## Vercel Deployment

1. Push code to GitHub repository

2. Connect repository to Vercel:
   - Create new project
   - Import repository
   - Configure build settings
   - Add environment variables

3. Configure deployment settings:
   - Framework preset: Next.js
   - Build command: `npm run build`
   - Output directory: `.next`
   - Install command: `npm install`

4. Deploy:
   - Automatic deployment on push to main branch
   - Manual deployment through Vercel dashboard

## Production Checklist

### Performance
- [ ] Enable caching
- [ ] Optimize images
- [ ] Minimize bundle size
- [ ] Configure CDN

### Security
- [ ] Enable HTTPS
- [ ] Configure CORS
- [ ] Set up rate limiting
- [ ] Implement security headers

### Monitoring
- [ ] Set up error tracking
- [ ] Configure performance monitoring
- [ ] Enable logging
- [ ] Set up alerts

### SEO
- [ ] Configure metadata
- [ ] Set up sitemap
- [ ] Enable robots.txt
- [ ] Verify with Google Search Console

## Maintenance

### Regular Tasks
1. Update dependencies
2. Monitor error logs
3. Check performance metrics
4. Backup database
5. Review security updates

### Troubleshooting

#### Common Issues

1. Database Connection
```bash
# Check database status
pg_isready -h localhost -p 5432

# View logs
heroku logs --tail
```

2. Build Errors
```bash
# Clear cache
npm run clean
# or
yarn clean

# Rebuild
npm run build
# or
yarn build
```

3. Runtime Errors
- Check application logs
- Verify environment variables
- Monitor server resources

## Backup and Recovery

### Database Backup
```bash
# Create backup
pg_dump -U username -d database_name > backup.sql

# Restore backup
psql -U username -d database_name < backup.sql
```

### File Backup
```bash
# Backup uploads
rsync -av /path/to/uploads/ /path/to/backup/

# Restore uploads
rsync -av /path/to/backup/ /path/to/uploads/
```

## Scaling

### Horizontal Scaling
- Configure load balancer
- Add application servers
- Set up Redis for session storage
- Implement caching strategy

### Vertical Scaling
- Upgrade server resources
- Optimize database queries
- Implement connection pooling
- Configure memory limits

## Monitoring and Analytics

### Tools
- Vercel Analytics
- Google Analytics
- Sentry for error tracking
- DataDog for performance monitoring

### Metrics to Monitor
- Response time
- Error rate
- CPU usage
- Memory usage
- Database performance
- API latency

## Rollback Procedures

### Code Rollback
```bash
# Revert to previous version
git revert HEAD

# Deploy previous version
git push origin main
```

### Database Rollback
```bash
# Revert last migration
npx prisma migrate reset
npx prisma migrate deploy
```

## Security Measures

1. **SSL/TLS Configuration**
   - Enable HTTPS
   - Configure SSL certificates
   - Set up automatic renewal

2. **Authentication**
   - Implement rate limiting
   - Set up brute force protection
   - Configure session management

3. **Data Protection**
   - Regular security audits
   - Data encryption at rest
   - Secure file uploads

## Compliance

1. **GDPR Compliance**
   - Privacy policy
   - Cookie consent
   - Data deletion process

2. **Accessibility**
   - WCAG compliance
   - Screen reader support
   - Keyboard navigation

## Documentation

Keep the following documentation updated:
- API documentation
- Database schema
- Deployment procedures
- Security protocols
- Backup procedures
