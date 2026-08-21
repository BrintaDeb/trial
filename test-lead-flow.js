const http = require('http');

async function runTest() {
    console.log("=== Testing Lead Generation Widget Flow ===\n");
    const baseUrl = 'http://localhost:3000';
    let passed = 0;
    let failed = 0;
    const query = encodeURIComponent("Plumbers in Seattle");

    // 1. Test /api/places-mock
    console.log("1. Testing GET /api/places-mock...");
    try {
        const placesRes = await new Promise((resolve, reject) => {
            http.get(`${baseUrl}/api/places-mock?q=${query}`, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => resolve({ statusCode: res.statusCode, data: JSON.parse(data) }));
            }).on('error', reject);
        });

        if (placesRes.statusCode === 200 && placesRes.data.success && placesRes.data.places.length === 5) {
            console.log("✅ Passed: Fetched 5 mock places successfully.");
            passed++;
        } else {
            console.log("❌ Failed: Did not fetch expected mock places.", placesRes);
            failed++;
        }
    } catch (err) {
        console.error("❌ Failed API Call:", err);
        failed++;
    }

    // 2. Test /api/capture-local-lead
    console.log("\n2. Testing POST /api/capture-local-lead...");
    try {
        const postData = JSON.stringify({
            name: "John Doe",
            email: "john@example.com",
            searchQuery: "Plumbers in Seattle"
        });

        const reqOptions = {
            hostname: 'localhost',
            port: 3000,
            path: '/api/capture-local-lead',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const captureRes = await new Promise((resolve, reject) => {
            const req = http.request(reqOptions, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => resolve({ statusCode: res.statusCode, data: JSON.parse(data) }));
            });
            req.on('error', reject);
            req.write(postData);
            req.end();
        });

        if (captureRes.statusCode === 200 && captureRes.data.success && captureRes.data.leadId) {
            console.log(`✅ Passed: Captured lead successfully. Lead ID: ${captureRes.data.leadId}`);
            passed++;
        } else {
            console.log("❌ Failed: Did not capture lead properly.", captureRes);
            failed++;
        }
    } catch (err) {
        console.error("❌ Failed API Call:", err);
        failed++;
    }

    console.log(`\n=== Test Results: ${passed} Passed, ${failed} Failed ===`);
    if (failed > 0) process.exit(1);
    else process.exit(0);
}

// Since the server needs to be running, we assume it's running on port 3000
// for this test to work. 
runTest();
