
    // Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyDruA1fSmRQqM-xDgJhgu9KKVGWj8GpuKQ",
        authDomain: "tree-kiosk-system-v2.firebaseapp.com",
        databaseURL: "https://tree-kiosk-system-v2-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "tree-kiosk-system-v2",
        storageBucket: "tree-kiosk-system-v2.appspot.com",
        messagingSenderId: "719927565453",
        appId: "1:719927565453:web:caa088914a03dcb2e896c4"
    };
    
    // Initialize Firebase
    const app = firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();

    // Google Sign-In
    const googleProvider = new firebase.auth.GoogleAuthProvider();
    document.getElementById('googleLoginBtn').addEventListener('click', async () => {
        try {
            const result = await auth.signInWithPopup(googleProvider);
            console.log('User is signed in:', result.user.email);
            show('front', 'login-container');
                } catch (error) {
            console.error('Error during Google sign-in:', error);
        }
    });

    // GitHub Sign-In
    const githubProvider = new firebase.auth.GithubAuthProvider();
    document.getElementById('githubLoginBtn').addEventListener('click', async () => {
        try {
            const result = await auth.signInWithPopup(githubProvider);
            console.log('User is signed in:', result.user.email);
            show('front', 'login-container');       
         } catch (error) {
            console.error('Error during GitHub sign-in:', error);
        }
    });

    // Monitor Auth State
    auth.onAuthStateChanged(user => {
        if (user) {
            console.log('User is signed in:', user.email);
            localStorage.setItem('user', user.email);
            show('front', 'login-container');
        } else {
            show('login-container', 'front');
        }
    });

    // Click counter and logout function
    let clickCount = 0;
    document.getElementById('logout-link').addEventListener('click', async (e) => {
        e.preventDefault(); // Prevent the default link behavior
        clickCount++; // Increment click count

        if (clickCount === 5) { // Check if clicked 5 times
            try {
                await auth.signOut();
                console.log('User signed out after 5 clicks');
                show('login-container', 'front'); // Show the login container after sign out
                clickCount = 0; // Reset click count after logout
            } catch (error) {
                console.error('Error during sign out:', error);
            }
        }
    });

    function show(shown, hidden) {
        document.getElementById(shown).style.display = 'block';
        document.getElementById(hidden).style.display = 'none';
    }