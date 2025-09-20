# Serverless E-commerce Platform - Frontend

A modern, scalable, and feature-rich e-commerce frontend built with React, TypeScript, and enterprise-grade features.

## 🚀 Features

### Core Features
- **Modern React Architecture**: Built with React 18+ and functional components
- **TypeScript Support**: Comprehensive type definitions for better development experience
- **Responsive Design**: Mobile-first approach with responsive layouts
- **State Management**: Efficient state management with React Query and Context API
- **Authentication**: Secure user authentication and authorization
- **Shopping Cart**: Full-featured shopping cart with persistence
- **Product Catalog**: Advanced product browsing with search and filtering
- **Order Management**: Complete order processing workflow

### Enterprise Features
- **Feature Flags**: Dynamic feature toggling and A/B testing
- **Analytics Integration**: Google Analytics, Segment, and Facebook Pixel
- **Internationalization**: Multi-language support with RTL layout
- **Theme System**: Dark/light mode with custom theme support
- **Performance Optimization**: Lazy loading, code splitting, and image optimization
- **Accessibility**: WCAG 2.1 compliant with ARIA labels and keyboard navigation

### Developer Experience
- **Hot Module Replacement**: Fast development with instant updates
- **ESLint & Prettier**: Code quality and formatting
- **Testing Setup**: Jest and React Testing Library
- **Storybook**: Component documentation and testing
- **Bundle Analysis**: Performance monitoring and optimization

## 📋 Prerequisites

- Node.js 16.x or higher
- npm 8.x or higher
- Git

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd serverless-ecommerce-platform/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env.local
   ```

4. **Configure environment variables**
   ```env
   # API Configuration
   REACT_APP_API_URL=http://localhost:3001
   REACT_APP_URL=http://localhost:3000

   # Analytics
   REACT_APP_GA_MEASUREMENT_ID=your-ga-id
   REACT_APP_SEGMENT_WRITE_KEY=your-segment-key
   REACT_APP_FB_PIXEL_ID=your-fb-pixel-id

   # Feature Flags
   REACT_APP_FEATURE_FLAGS_API=your-feature-flags-api

   # Other
   REACT_APP_VERSION=1.0.0
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Basic UI components
│   ├── forms/           # Form components
│   ├── layout/          # Layout components
│   ├── product/         # Product-related components
│   ├── cart/            # Shopping cart components
│   ├── auth/            # Authentication components
│   └── providers/       # Context providers
├── hooks/               # Custom React hooks
│   ├── useAuth.js       # Authentication hook
│   ├── useCart.js       # Shopping cart hook
│   ├── useTheme.js      # Theme management hook
│   ├── useAnalytics.js  # Analytics hook
│   └── ...
├── pages/               # Page components
├── services/            # API services
├── store/               # State management
├── utils/               # Utility functions
├── types/               # TypeScript type definitions
├── styles/              # Global styles
└── assets/              # Static assets
```

## 🎨 Component Library

### Basic Components

```jsx
import { Button, Input, Card, Modal } from './components/ui'

// Button usage
<Button variant="primary" size="lg" onClick={handleClick}>
  Click me
</Button>

// Input usage
<Input
  label="Email"
  type="email"
  value={email}
  onChange={setEmail}
  error={emailError}
/>

// Card usage
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Body>Content</Card.Body>
  <Card.Footer>Actions</Card.Footer>
</Card>
```

### Product Components

```jsx
import { ProductCard, ProductGrid, ProductDetails } from './components/product'

// Product grid with virtualization
<ProductGrid
  products={products}
  loading={loading}
  virtualized={true}
  onProductClick={handleProductClick}
/>

// Product card
<ProductCard
  product={product}
  onAddToCart={handleAddToCart}
  onWishlistToggle={handleWishlistToggle}
/>
```

### Cart Components

```jsx
import { CartDrawer, CartItem, CartSummary } from './components/cart'

// Cart drawer
<CartDrawer
  open={cartOpen}
  onClose={handleCartClose}
  items={cartItems}
  onUpdateQuantity={handleUpdateQuantity}
  onRemoveItem={handleRemoveItem}
/>
```

## 🔧 Custom Hooks

### Authentication Hook

```jsx
import { useAuth } from './hooks/useAuth'

function MyComponent() {
  const { user, login, logout, isLoading, isAuthenticated } = useAuth()
  
  const handleLogin = async (credentials) => {
    try {
      await login(credentials)
    } catch (error) {
      console.error('Login failed:', error)
    }
  }
  
  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user.firstName}!</p>
      ) : (
        <LoginForm onSubmit={handleLogin} />
      )}
    </div>
  )
}
```

### Shopping Cart Hook

```jsx
import { useCart } from './hooks/useCart'

function ProductPage({ product }) {
  const { addItem, removeItem, updateQuantity, items, total } = useCart()
  
  const handleAddToCart = () => {
    addItem(product, 1)
  }
  
  return (
    <div>
      <ProductDetails product={product} />
      <Button onClick={handleAddToCart}>
        Add to Cart
      </Button>
    </div>
  )
}
```

### Theme Hook

```jsx
import { useTheme } from './hooks/useTheme'

function ThemeToggle() {
  const { theme, toggleTheme, isDark } = useTheme()
  
  return (
    <Button onClick={toggleTheme}>
      {isDark ? '☀️' : '🌙'} {theme}
    </Button>
  )
}
```

### Analytics Hook

```jsx
import { useAnalytics, useEcommerceAnalytics } from './hooks/useAnalytics'

function ProductPage({ product }) {
  const { track } = useAnalytics()
  const { trackProductView, trackAddToCart } = useEcommerceAnalytics()
  
  useEffect(() => {
    trackProductView(product)
  }, [product])
  
  const handleAddToCart = () => {
    trackAddToCart(product, 1)
    // Add to cart logic
  }
  
  return (
    <div>
      {/* Product content */}
    </div>
  )
}
```

## 🌍 Internationalization

### Setup

```jsx
import { I18nProvider } from './hooks/useInternationalization'

function App() {
  return (
    <I18nProvider defaultLocale="en">
      <YourApp />
    </I18nProvider>
  )
}
```

### Usage

```jsx
import { useTranslation } from './hooks/useInternationalization'

function MyComponent() {
  const { t, locale, setLocale } = useTranslation()
  
  return (
    <div>
      <h1>{t('nav.home')}</h1>
      <p>{t('product.addToCart')}</p>
      
      <select value={locale} onChange={(e) => setLocale(e.target.value)}>
        <option value="en">English</option>
        <option value="es">Español</option>
        <option value="fr">Français</option>
      </select>
    </div>
  )
}
```

## 🎯 Feature Flags

### Setup

```jsx
import { FeatureFlagsProvider } from './hooks/useFeatureFlags'

function App() {
  return (
    <FeatureFlagsProvider
      apiUrl={process.env.REACT_APP_FEATURE_FLAGS_API}
      userId={user?.id}
    >
      <YourApp />
    </FeatureFlagsProvider>
  )
}
```

### Usage

```jsx
import { useFeatureFlags } from './hooks/useFeatureFlags'

function MyComponent() {
  const { isEnabled, getVariant } = useFeatureFlags()
  
  return (
    <div>
      {isEnabled('new-checkout-flow') && (
        <NewCheckoutComponent />
      )}
      
      {isEnabled('ab-test-button-color') && (
        <Button color={getVariant('ab-test-button-color', 'blue')}>
          Click me
        </Button>
      )}
    </div>
  )
}
```

## 📊 Performance Optimization

### Lazy Loading

```jsx
import { LazyImage } from './components/ui/lazy-image'

function ProductCard({ product }) {
  return (
    <div>
      <LazyImage
        src={product.image}
        alt={product.name}
        placeholder="blur"
        loading="lazy"
      />
    </div>
  )
}
```

### Code Splitting

```jsx
import { lazy, Suspense } from 'react'

const ProductPage = lazy(() => import('./pages/ProductPage'))
const CartPage = lazy(() => import('./pages/CartPage'))

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </Suspense>
  )
}
```

### Virtualization

```jsx
import { VirtualList } from './components/ui/virtual-list'

function ProductList({ products }) {
  return (
    <VirtualList
      items={products}
      itemHeight={200}
      renderItem={({ item, index }) => (
        <ProductCard key={item.id} product={item} />
      )}
    />
  )
}
```

## 🧪 Testing

### Unit Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Component Testing

```jsx
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from './Button'

test('renders button with text', () => {
  render(<Button>Click me</Button>)
  expect(screen.getByText('Click me')).toBeInTheDocument()
})

test('calls onClick when clicked', () => {
  const handleClick = jest.fn()
  render(<Button onClick={handleClick}>Click me</Button>)
  
  fireEvent.click(screen.getByText('Click me'))
  expect(handleClick).toHaveBeenCalledTimes(1)
})
```

## 📦 Building for Production

```bash
# Build for production
npm run build

# Analyze bundle size
npm run analyze

# Preview production build
npm run preview
```

## 🚀 Deployment

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

### Docker

```dockerfile
FROM node:16-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------||
| `REACT_APP_API_URL` | Backend API URL | `http://localhost:3001` |
| `REACT_APP_GA_MEASUREMENT_ID` | Google Analytics ID | - |
| `REACT_APP_SEGMENT_WRITE_KEY` | Segment write key | - |
| `REACT_APP_FB_PIXEL_ID` | Facebook Pixel ID | - |
| `REACT_APP_FEATURE_FLAGS_API` | Feature flags API URL | - |

### Theme Customization

```jsx
import { ThemeProvider } from './hooks/useTheme'

const customTheme = {
  colors: {
    primary: {
      500: '#your-primary-color'
    }
  }
}

function App() {
  return (
    <ThemeProvider customThemes={{ custom: customTheme }}>
      <YourApp />
    </ThemeProvider>
  )
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Use TypeScript for all new components
- Follow the existing component structure
- Write tests for new features
- Update documentation as needed

### Commit Convention

```
feat: add new feature
fix: bug fix
docs: documentation changes
style: formatting changes
refactor: code refactoring
test: adding tests
chore: maintenance tasks
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 Email: support@example.com
- 💬 Discord: [Join our community](https://discord.gg/example)
- 📖 Documentation: [docs.example.com](https://docs.example.com)
- 🐛 Issues: [GitHub Issues](https://github.com/example/issues)

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- All contributors who helped build this project

---

Made with ❤️ by Lance Cabanit

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
