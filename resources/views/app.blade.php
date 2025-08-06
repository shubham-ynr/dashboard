<!DOCTYPE html>
<html>

<head>
  <script>
    (function() {
      const theme = localStorage.getItem('theme') || 'system';
      if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.add('light');
      }
    })();
  </script>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  @routes
  @viteReactRefresh
  @vite('resources/css/app.css')
  @vite('resources/js/app.jsx')
  @inertiaHead
</head>

<body>
  @inertia
</body>

</html>