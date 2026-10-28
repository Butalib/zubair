# CSS Classes Reference - Products Page

## Layout Classes

### `.products-page`
Container الرئيسي للصفحة
- `min-height: calc(100dvh - var(--layout-header-total, 114px))`
- `background: #faf8f4`
- `padding-bottom: 4rem`

### `.page-header`
رأس الصفحة مع العنوان
- Gradient background
- Border bottom
- Contains: `__inner`, `__title`, `__subtitle`

### `.products-page__container`
الـ Container الرئيسي للمحتوى
- `max-width: 1200px`
- Centered with `margin-inline: auto`
- Responsive padding

### `.products-layout`
Grid container للـ sidebar والمنتجات
- **Desktop**: `grid-template-columns: 260px 1fr`
- **Mobile**: `grid-template-columns: 1fr`

## Toolbar Classes

### `.toolbar`
شريط البحث والترتيب
- **Desktop**: `display: flex`
- **Mobile**: `flex-wrap: wrap`

### `.search-box`
مربع البحث
- Contains: input + icon
- Full width on mobile
- RTL direction

### `.sort-box`
قائمة الترتيب
- Fixed width on desktop (140px)
- Flexible on mobile
- Custom select styling

## Filters Sidebar

### `.filters-sidebar`
الـ Sidebar للتصفية
- **Desktop**: Sticky positioning (`position: sticky; top: 1rem`)
- **Mobile**: Collapsible

### `.filters-sidebar__header`
رأس الـ sidebar
- Clickable على Mobile
- Contains title + icon
- Border bottom

### `.filters-sidebar__content`
محتوى الفلاتر
- **Desktop**: Always visible, scrollable
- **Mobile**: Grid animation (0fr -> 1fr)

### `.filters-sidebar__wrapper`
Wrapper للـ animation
- Handles overflow on mobile

### `.filter-group`
مجموعة فلاتر (قسم أو ماركة)
- Padding: `1rem`
- Border bottom (except last)

### `.filter-option`
خيار فلتر واحد
- Checkbox + label
- Display: flex
- Gap: `0.5rem`

### `.clear-filters`
زر إعادة التعيين
- Full width with margin
- Hover effect
- Border + background transition

## Products Display

### `.products-stage`
Container للمنتجات
- `min-width: 0` (grid fix)

### `.products-grid`
Grid للمنتجات
- Auto-fill columns
- Minimum column width: 280px
- Gap: `1.15rem`

### `.product-card`
بطاقة المنتج
- White background
- Border radius: `0.75rem`
- Shadow with hover effect
- Transform on hover: `translateY(-3px)`

### `.product-card__image`
صورة المنتج
- Aspect ratio: `1.04`
- Contains: image, badge, wishlist button
- Hover scale effect on image

### `.product-card__badge`
شارة "كمية محدودة"
- Position: absolute top-left (RTL)
- Background: `#b8841f`
- Z-index: 2

### `.product-card__body`
محتوى البطاقة
- Flex column
- Min height: `8.5rem`
- Padding: `0.8rem 0.75rem 0.7rem`

### `.product-card__brand`
اسم الماركة
- Color: `#aaa39a`
- Font size: `0.62rem`

### `.product-card__name`
اسم المنتج
- Line clamp: 2 lines
- Font weight: 700
- Min height: `2.35rem`

### `.product-card__description`
وصف المنتج
- Line clamp: 2 lines
- Color: `#aaa39a`
- Font size: `0.62rem`

### `.product-card__footer`
تذييل البطاقة (السعر + زر)
- Display: flex
- Justify: space-between
- Margin top: auto

### `.product-card__price`
السعر
- Display: flex with gap
- Contains: strong (current price) + del (old price)

### `.wishlist-button`
زر المفضلة
- Position: absolute bottom-left (RTL)
- Size: `1.9rem × 1.9rem`
- Background: white with shadow
- Active state: red color

### `.cart-button`
زر السلة
- Size: `1.9rem × 1.9rem`
- Circular
- Background: `#efa925`
- Scale animation on add

## Loading & Empty States

### `.shimmer-block`
عنصر loading skeleton
- Used in `.product-card--skeleton`
- Min height: `1rem`
- Border radius: `0.35rem`

### `.filters-skeleton`
Skeleton للفلاتر
- Grid with gap
- Multiple shimmer blocks

### `.products-state`
Empty/error state
- Centered content
- Min height: `320px`
- Background: `rgba(255, 255, 255, 0.72)`

## Pagination

### `.pagination`
Container للـ pagination
- Display: flex
- Centered
- Gap: `0.35rem`

### `.pagination__active`
الصفحة النشطة
- Color: white
- Background: `#efa925`
- Border color: `#efa925`

## Responsive Modifiers

### Mobile (< 900px)
- `.filters-sidebar`: Collapsible
- `.products-layout`: Single column
- `.products-stage`: Order 1 (appears first)

### Tablet (< 760px)
- `.toolbar`: Flex wrap
- `.search-box`: Full width, order 1
- `.sort-box`: Flexible width, order 2

### Small Mobile (< 560px)
- Smaller paddings
- Reduced gaps
- Smaller font sizes

## Utility Classes

### `.shimmer-block--title`
Shimmer للعنوان: `width: 70%`

### `.shimmer-block--text`
Shimmer للنص: `width: 90%`

### `.shimmer-block--price`
Shimmer للسعر: `width: 38%`

## State Modifiers

### `.is-expanded`
على `.filters-sidebar` في Mobile
- Rotates chevron icon
- Expands content grid

### `.is-added`
على `.cart-button` عند الإضافة
- Transform: `scale(1.12)`
- Duration: 700ms

### `.wishlist-button--active`
زر مفضلة نشط
- Color: `#d94343` (red)

## Color Palette

```scss
// Primary
$primary-gold: #efa925;
$primary-dark-gold: #b8841f;

// Neutrals
$neutral-dark: #242424;
$neutral-gray: #5e5a54;
$neutral-light-gray: #aaa39a;

// Backgrounds
$bg-page: #faf8f4;
$bg-white: #fff;
$bg-card: #f3f2ee;

// Borders
$border-light: #e8e4dc;
$border-lighter: #f0ede7;

// States
$error-red: #d94343;
```

## Typography Scale

```scss
// Headings
.page-header__title: clamp(1.7rem, 3vw, 2.25rem)
.filter-group__title: 0.78rem
.filters-sidebar__title: 0.95rem

// Body
.product-card__name: 0.78rem
.product-card__description: 0.62rem
.product-card__brand: 0.62rem
.product-card__price: 0.72rem

// Buttons
.clear-filters: 0.76rem
```

## Z-index Stack

```
3: .wishlist-button (on product image)
2: .product-card__badge
1: .search-box, .sort-box
```

## Important Notes

1. جميع الـ Classes تستخدم BEM methodology
2. RTL layout مطبق على جميع العناصر
3. Responsive breakpoints متسقة
4. Color variables يمكن تخصيصها
5. Typography scale responsive باستخدام clamp()
