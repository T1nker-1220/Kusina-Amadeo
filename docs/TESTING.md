# Testing Documentation

## Overview

This document outlines the testing strategy and implementation for the Kusina Amadeo website.

## Testing Stack

- **Jest**: Unit testing framework
- **React Testing Library**: Component testing
- **Cypress**: End-to-end testing
- **MSW (Mock Service Worker)**: API mocking
- **Playwright**: Cross-browser testing
- **Vitest**: Unit test runner

## Test Types

### 1. Unit Tests

Located in `__tests__` directories alongside the code they test.

```typescript
// Button.test.tsx
import { render, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button Component', () => {
  it('renders correctly', () => {
    const { getByText } = render(<Button>Click me</Button>);
    expect(getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    const { getByText } = render(
      <Button onClick={handleClick}>Click me</Button>
    );
    
    fireEvent.click(getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('supports different variants', () => {
    const { getByText } = render(
      <Button variant="primary">Primary Button</Button>
    );
    
    const button = getByText('Primary Button');
    expect(button).toHaveClass('bg-primary');
  });
});
```

### 2. Integration Tests

Testing multiple components working together.

```typescript
// MenuPage.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { MenuPage } from './MenuPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

describe('Menu Page', () => {
  beforeEach(() => {
    render(
      <QueryClientProvider client={queryClient}>
        <MenuPage />
      </QueryClientProvider>
    );
  });

  it('loads and displays menu items', async () => {
    await waitFor(() => {
      expect(screen.getByText('Menu Items')).toBeInTheDocument();
    });
    
    const menuItems = screen.getAllByTestId('menu-item');
    expect(menuItems).toHaveLength(6);
  });

  it('filters menu items by category', async () => {
    const categoryFilter = screen.getByLabelText('Category');
    fireEvent.change(categoryFilter, { target: { value: 'Appetizers' } });
    
    await waitFor(() => {
      const menuItems = screen.getAllByTestId('menu-item');
      expect(menuItems).toHaveLength(2);
    });
  });
});
```

### 3. E2E Tests

Using Cypress for end-to-end testing.

```typescript
// cypress/e2e/order-flow.cy.ts
describe('Order Flow', () => {
  beforeEach(() => {
    cy.visit('/menu');
  });

  it('completes an order flow', () => {
    // Add item to cart
    cy.get('[data-testid="menu-item"]').first().click();
    cy.get('[data-testid="add-to-cart"]').click();
    
    // View cart
    cy.get('[data-testid="cart-icon"]').click();
    cy.get('[data-testid="cart-items"]').should('have.length', 1);
    
    // Checkout process
    cy.get('[data-testid="checkout-button"]').click();
    cy.get('[data-testid="customer-name"]').type('John Doe');
    cy.get('[data-testid="customer-email"]').type('john@example.com');
    cy.get('[data-testid="submit-order"]').click();
    
    // Order confirmation
    cy.url().should('include', '/order-confirmation');
    cy.get('[data-testid="order-number"]').should('exist');
  });
});
```

### 4. API Tests

Testing API endpoints using Jest and Supertest.

```typescript
// api/menu.test.ts
import { createMocks } from 'node-mocks-http';
import menuHandler from './menu';

describe('Menu API', () => {
  it('returns menu items', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await menuHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data.items).toBeInstanceOf(Array);
  });

  it('creates a menu item', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        name: 'New Item',
        price: 9.99,
        description: 'Test description'
      }
    });

    await menuHandler(req, res);

    expect(res._getStatusCode()).toBe(201);
    const data = JSON.parse(res._getData());
    expect(data.id).toBeDefined();
  });
});
```

## Component Testing Strategy

### 1. Presentational Components

Test the rendering and styling:

```typescript
// Card.test.tsx
describe('Card Component', () => {
  it('renders with correct styles', () => {
    const { container } = render(
      <Card variant="elevated">
        <p>Content</p>
      </Card>
    );
    
    expect(container.firstChild).toHaveClass('shadow-lg');
  });

  it('applies hover effects', () => {
    const { container } = render(
      <Card hover>
        <p>Content</p>
      </Card>
    );
    
    expect(container.firstChild).toHaveClass('hover:shadow-xl');
  });
});
```

### 2. Interactive Components

Test user interactions and state changes:

```typescript
// Dropdown.test.tsx
describe('Dropdown Component', () => {
  it('opens on click', () => {
    const { getByRole, getByTestId } = render(
      <Dropdown options={['Option 1', 'Option 2']} />
    );
    
    fireEvent.click(getByRole('button'));
    expect(getByTestId('dropdown-menu')).toBeVisible();
  });

  it('selects an option', () => {
    const handleSelect = jest.fn();
    const { getByText, getByRole } = render(
      <Dropdown 
        options={['Option 1', 'Option 2']} 
        onSelect={handleSelect} 
      />
    );
    
    fireEvent.click(getByRole('button'));
    fireEvent.click(getByText('Option 1'));
    
    expect(handleSelect).toHaveBeenCalledWith('Option 1');
  });
});
```

### 3. Form Components

Test form validation and submission:

```typescript
// LoginForm.test.tsx
describe('LoginForm Component', () => {
  it('validates required fields', async () => {
    const { getByRole, getByText } = render(<LoginForm />);
    
    fireEvent.click(getByRole('button', { name: /submit/i }));
    
    expect(getByText('Email is required')).toBeInTheDocument();
    expect(getByText('Password is required')).toBeInTheDocument();
  });

  it('submits valid form data', async () => {
    const handleSubmit = jest.fn();
    const { getByLabelText, getByRole } = render(
      <LoginForm onSubmit={handleSubmit} />
    );
    
    fireEvent.change(getByLabelText('Email'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(getByLabelText('Password'), {
      target: { value: 'password123' }
    });
    fireEvent.click(getByRole('button', { name: /submit/i }));
    
    expect(handleSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    });
  });
});
```

## Test Coverage

### Coverage Goals

- Unit Tests: 80% coverage
- Integration Tests: 70% coverage
- E2E Tests: Critical user paths

### Running Coverage Reports

```bash
# Unit test coverage
npm run test:coverage

# E2E test coverage
npm run cypress:coverage
```

## Continuous Integration

### GitHub Actions Workflow

```yaml
name: Test Suite
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: npm run test
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Upload coverage
        uses: actions/upload-artifact@v2
        with:
          name: coverage
          path: coverage/
```

## Best Practices

### 1. Test Organization

```typescript
describe('Component Name', () => {
  // Setup
  beforeEach(() => {
    // Common setup
  });

  // Grouping related tests
  describe('feature or behavior', () => {
    it('specific test case', () => {
      // Test implementation
    });
  });

  // Cleanup
  afterEach(() => {
    // Cleanup after tests
  });
});
```

### 2. Mocking

```typescript
// Mocking API calls
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: {} })),
  post: jest.fn(() => Promise.resolve({ data: {} }))
}));

// Mocking hooks
jest.mock('react-query', () => ({
  useQuery: jest.fn(() => ({
    data: mockData,
    isLoading: false,
    error: null
  }))
}));
```

### 3. Custom Renders

```typescript
// test-utils.tsx
const AllTheProviders = ({ children }) => {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </ThemeProvider>
  );
};

const customRender = (ui: React.ReactElement, options = {}) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
```

## Debugging Tests

### Common Issues and Solutions

1. **Async Testing**
```typescript
// Wrong
it('loads data', () => {
  const { getByText } = render(<Component />);
  expect(getByText('Loaded')).toBeInTheDocument();
});

// Right
it('loads data', async () => {
  const { findByText } = render(<Component />);
  expect(await findByText('Loaded')).toBeInTheDocument();
});
```

2. **Event Testing**
```typescript
// Wrong
it('updates on change', () => {
  fireEvent.change(input, { target: { value: 'new' } });
  expect(output).toHaveTextContent('new');
});

// Right
it('updates on change', async () => {
  fireEvent.change(input, { target: { value: 'new' } });
  await waitFor(() => {
    expect(output).toHaveTextContent('new');
  });
});
```

## Performance Testing

### Lighthouse CI

```yaml
name: Lighthouse CI
on: [push]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v3
        with:
          urls: |
            https://staging.kusinamadeo.com/
          budgetPath: ./budget.json
          uploadArtifacts: true
```

### Load Testing

Using k6 for API load testing:

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10,
  duration: '30s',
};

export default function () {
  const res = http.get('https://api.kusinamadeo.com/menu');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  sleep(1);
}
```
