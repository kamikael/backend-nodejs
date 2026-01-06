const baseUrl = 'http://localhost:3000/auth';

async function test() {
    const email = `test-${Date.now()}@example.com`;
    const password = 'Password123!';

    console.log('--- 1. Testing Signup ---');
    const signupRes = await fetch(`${baseUrl}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name: 'Test User' })
    });
    const signupData = await signupRes.json();
    console.log('Status:', signupRes.status);
    console.log('Response:', JSON.stringify(signupData, null, 2));
    if (!signupData.ok) process.exit(1);

    console.log('\n--- 2. Testing Login ---');
    const loginRes = await fetch(`${baseUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    const loginData = await loginRes.json();
    console.log('Status:', loginRes.status);
    // console.log('Response:', loginData); 
    if (!loginData.ok) process.exit(1);
    console.log('Login OK, tokens received.');

    const { accessToken, refreshToken } = loginData.data;

    console.log('\n--- 3. Testing Refresh Token ---');
    const refreshRes = await fetch(`${baseUrl}/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
    });
    const refreshData = await refreshRes.json();
    console.log('Status:', refreshRes.status);
    if (!refreshData.ok) {
        console.log('Error:', refreshData);
        process.exit(1);
    }
    console.log('Refresh OK, new tokens received.');

    const newAccessToken = refreshData.data.accessToken;

    console.log('\n--- 4. Testing Change Password ---');
    const changeRes = await fetch(`${baseUrl}/change-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${newAccessToken}`
        },
        body: JSON.stringify({ oldPassword: password, newPassword: 'NewPassword123!' })
    });
    const changeData = await changeRes.json();
    console.log('Status:', changeRes.status);
    console.log('Response:', changeData);
    if (!changeData.ok) process.exit(1);

    console.log('\n--- 5. Testing Login with New Password ---');
    const login2Res = await fetch(`${baseUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: 'NewPassword123!' })
    });
    const login2Data = await login2Res.json();
    console.log('Status:', login2Res.status);
    if (!login2Data.ok) {
        console.log('Error:', login2Data);
        process.exit(1);
    }
    console.log('Login with new password OK.');

    console.log('\n--- 6. Testing Logout ---');
    const logoutRes = await fetch(`${baseUrl}/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: refreshData.data.refreshToken })
    });
    const logoutData = await logoutRes.json();
    console.log('Status:', logoutRes.status);
    console.log('Response:', logoutData);

    console.log('\n--- VERIFICATION COMPLETE ---');
}

test().catch(err => {
    console.error('Test Failed:', err);
    process.exit(1);
});
