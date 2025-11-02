# ProfileCard Component

A stunning 3D animated profile card component with tilt effects, holographic shine, and customizable gradients.

## Features

- 🎨 Beautiful holographic effects and gradients
- 🎭 3D tilt animation on mouse movement
- 📱 Mobile tilt support with device orientation
- ⚡ Optimized performance with React.memo
- 🎯 Fully customizable appearance
- 📦 TypeScript support

## Usage

```tsx
import ProfileCard from './components/ProfileCard';

function MyComponent() {
  return (
    <ProfileCard
      avatarUrl="https://example.com/avatar.jpg"
      name="John Doe"
      title="CEO & Founder"
      handle="johndoe"
      status="Available"
      contactText="Get in Touch"
      onContactClick={() => console.log('Contact clicked!')}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `avatarUrl` | `string` | `'<Placeholder for avatar URL>'` | Main avatar image URL |
| `miniAvatarUrl` | `string` | `avatarUrl` | Small avatar in user info section |
| `name` | `string` | `'Javi A. Torres'` | Person's name |
| `title` | `string` | `'Software Engineer'` | Person's title/role |
| `handle` | `string` | `'javicodes'` | Username/handle (without @) |
| `status` | `string` | `'Online'` | Current status text |
| `contactText` | `string` | `'Contact'` | Contact button text |
| `showUserInfo` | `boolean` | `true` | Show/hide bottom user info section |
| `enableTilt` | `boolean` | `true` | Enable 3D tilt effect |
| `enableMobileTilt` | `boolean` | `false` | Enable device orientation tilt |
| `mobileTiltSensitivity` | `number` | `5` | Mobile tilt sensitivity (1-10) |
| `className` | `string` | `''` | Additional CSS classes |
| `iconUrl` | `string` | - | Icon pattern for shine effect |
| `grainUrl` | `string` | - | Grain texture URL |
| `behindGradient` | `string` | Default gradient | Custom background gradient |
| `innerGradient` | `string` | Default gradient | Custom inner gradient |
| `showBehindGradient` | `boolean` | `true` | Show/hide behind gradient glow |
| `onContactClick` | `() => void` | - | Contact button click handler |

## Examples

### Basic Card
```tsx
<ProfileCard
  avatarUrl="/team/jacob.jpg"
  name="Jacob Akanji"
  title="CEO & Founder"
  handle="jacobakanji"
/>
```

### Card with Custom Colors
```tsx
<ProfileCard
  avatarUrl="/team/rebecca.jpg"
  name="Rebecca Owen"
  title="Operations Lead"
  handle="rebeccaowen"
  behindGradient="radial-gradient(circle, #ff6b6b, #4ecdc4)"
  innerGradient="linear-gradient(145deg, #2c3e50, #34495e)"
/>
```

### Card Without User Info
```tsx
<ProfileCard
  avatarUrl="/team/member.jpg"
  name="Team Member"
  title="Developer"
  showUserInfo={false}
/>
```

### Mobile-Friendly Card
```tsx
<ProfileCard
  avatarUrl="/team/member.jpg"
  name="Team Member"
  title="Designer"
  enableMobileTilt={true}
  mobileTiltSensitivity={7}
/>
```

## Customization

### Custom Gradients

You can customize the card's appearance with custom gradients:

```tsx
<ProfileCard
  behindGradient="radial-gradient(circle at 50% 50%, #your-color-1, #your-color-2)"
  innerGradient="linear-gradient(145deg, #your-color-3, #your-color-4)"
/>
```

### Disable Effects

```tsx
<ProfileCard
  enableTilt={false}
  showBehindGradient={false}
/>
```

## Styling

The component uses CSS custom properties (CSS variables) for dynamic styling. You can override these in your own CSS:

```css
.my-custom-card {
  --card-radius: 20px; /* Change border radius */
}
```

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

The component is optimized with:
- React.memo for preventing unnecessary re-renders
- requestAnimationFrame for smooth animations
- Efficient event listeners with cleanup
- CSS transforms for hardware acceleration

## Notes

- Mobile tilt requires HTTPS and user permission
- The component is fully responsive
- Avatar images should be high quality for best results
- Contact button has `pointer-events: auto` to work with the tilt effect
