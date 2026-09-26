// Frontend-only demo mode: no backend is required. Any username/password
// combination "logs in" as the selected role with a locally-generated token.
const base64url = (obj) => btoa(JSON.stringify(obj)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

export const DEMO_ROLES = ['Student', 'Teacher', 'Parent', 'Principal', 'Admin'];

export const makeDemoToken = (userType, username) => {
  const header = base64url({ alg: 'none', typ: 'JWT' });
  const payload = base64url({
    sub: username || `demo-${userType.toLowerCase()}`,
    userType,
    demo: true,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 30 days
  });
  return `${header}.${payload}.demo`;
};
