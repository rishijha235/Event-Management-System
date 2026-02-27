export const getDashboardPathByRole = (role) => {
  switch (role) {
    case 'admin':
      return '/admin/dashboard';
    case 'vendor':
      return '/vendor/dashboard';
    case 'user':
      return '/user/dashboard';
    default:
      return '/index';
  }
};
