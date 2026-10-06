# ecommercewebb
front end code for my ecommerce application.<br>
the backend:
check the [ecommerce repository](https://github.com/Mazindere-Oluoch/ecommerce)

# app layout
landing page - show marketplace
 - navbar with login & sign up btns

- how pages and authentication boundaries break down between public, customer, and admin users:

```
[ Unauthenticated Visitor ]
  │
  ├──► Home / Landing Page (Banners, Categories, Featured Products)
  ├──► Product Catalog / Search & Filtering
  ├──► Product Detail Page
  ├──► Add to Cart (Can use LocalStorage or Session Cart)
  │
  └───► "Proceed to Checkout" ──(Prompt Auth)──► Login / Register
                                                    │
                                                    ▼
                                       [ Authenticated Customer ]
                                        ├──► Complete Checkout / Place Order
                                        ├──► View Order History & Tracking
                                        ├──► Manage Wishlist
                                        └──► Leave Product Reviews
```
## Public Access (No Login Required)
- Visitors should be able to freely explore the market place:

- Landing Page: Hero banner (promotions/coupons), featured categories, top-selling products, and general site FAQs/policies.
- Product Catalog: List all products with search, sorting, and category filters.
- Product Detail Page: View images, descriptions, pricing, stock status, and existing customer reviews.
- Shopping Cart: Add/remove items and view the cart total (stored in browser local storage or guest session).

## Authenticated Customer Access (Login Prompt Triggered)
- A user is prompted to register/login when attempting high-intent actions:
- Proceed to Checkout: Converting the cart into a real Order (requires shipping address & payment).
- Wishlist Management: Saving items to a Wishlist (needs to persist to the user's DB account).
- Writing Reviews: Posting a Review (typically restricted to users who bought the product).
- Order History: Viewing past orders and statuses.

## Admin Access (Role-Based Authorization - ADMIN)
- Admins manage store operations through an isolated Admin Dashboard `(/admin):`
- **Catalog Management:** Upload/edit/delete Category and Product items (including stock counts and images).
- **Order Management:** View all incoming customer orders, update delivery statuses (PENDING $\rightarrow$ SHIPPED $\rightarrow$ DELIVERED), and process returns/cancels.
- **Promotions:** Create and manage Coupon discounts.

# API Security Boundaries (SecurityConfig)
- Translating this flow into Spring Security rules:

```java
.authorizeHttpRequests(auth -> auth
    // Public Endpoints
    .requestMatchers("/api/v1/auth/**").permitAll()
    .requestMatchers(HttpMethod.GET, "/api/v1/products/**", "/api/v1/categories/**", "/api/v1/reviews/**").permitAll()
    .requestMatchers(HttpMethod.GET, "/api/v1/coupons/validate").permitAll()
    
    // Customer Endpoints
    .requestMatchers("/api/v1/cart/**", "/api/v1/wishlist/**", "/api/v1/orders/**").hasRole("CUSTOMER")
    .requestMatchers(HttpMethod.POST, "/api/v1/reviews/**").hasRole("CUSTOMER")
    
    // Admin Endpoints
    .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
    .requestMatchers(HttpMethod.POST, "/api/v1/products/**", "/api/v1/categories/**").hasRole("ADMIN")
    .requestMatchers(HttpMethod.PUT, "/api/v1/products/**", "/api/v1/categories/**").hasRole("ADMIN")
    .requestMatchers(HttpMethod.DELETE, "/api/v1/products/**", "/api/v1/categories/**").hasRole("ADMIN")
    
    .anyRequest().authenticated()
)
```
## Recommended Entity Refactoring Order
- Refactoring in order of domain dependencies ensures each step builds cleanly on the last:
- Category & Product Entities (Core Catalog): Products rely on categories. Refactor Category first, then Product (@ManyToOne to Category).
- Product DTOs & Services: Create public endpoints for listing, filtering, and fetching product details.
- Cart & CartItems: Implement cart management (either local-first or backed by a user cart table).
- Order & OrderItems: Build the checkout pipeline that converts cart items into a locked Order tied to a User.
- Wishlist, Reviews, & Coupons: Add auxiliary customer features once the core purchase flow is working


