# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - button "HouseIQ" [ref=e6] [cursor=pointer]:
      - generic [ref=e10]: HouseIQ
    - generic [ref=e12]:
      - heading "Welcome Back 👋" [level=2] [ref=e13]
      - paragraph [ref=e14]: Sign in to your account to continue
      - generic [ref=e15]:
        - generic [ref=e16]:
          - paragraph [ref=e17]: Email
          - textbox "Enter your email" [ref=e18]
        - generic [ref=e19]:
          - paragraph [ref=e20]: Password
          - textbox "Enter your password" [ref=e21]
      - generic [ref=e22]:
        - button "Sign In" [ref=e23] [cursor=pointer]
        - button "Create Account" [ref=e24] [cursor=pointer]
      - paragraph [ref=e25]:
        - text: Don't have an account?
        - link "Sign Up" [ref=e26] [cursor=pointer]:
          - /url: /register
  - generic:
    - region "Notifications-top"
    - region "Notifications-top-left"
    - region "Notifications-top-right"
    - region "Notifications-bottom-left"
    - region "Notifications-bottom"
    - region "Notifications-bottom-right"
```