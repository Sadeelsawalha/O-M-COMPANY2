// مسح البيانات + إعادة تهيئة المستخدمين
function clearStorage() {
    localStorage.removeItem("users");
    localStorage.removeItem("currentUser");

    const defaultUsers = {
        "sadeel": { pass: "123456", hours:0, lastIn:"", lastOut:"", inLocation:"", outLocation:"", profileImage:"" },
        "ahmad":  { pass: "9999", hours:0, lastIn:"", lastOut:"", inLocation:"", outLocation:"", profileImage:"" },
        "rose":   { pass: "1234", hours:0, lastIn:"", lastOut:"", inLocation:"", outLocation:"", profileImage:"" },
        "admin":  { pass: "admin_2025", hours:0, lastIn:"", lastOut:"", inLocation:"", outLocation:"", profileImage:"" }
    };
    localStorage.setItem("users", JSON.stringify(defaultUsers));

    alert("تم مسح البيانات القديمة وإعادة تهيئة المستخدمين!");
}

// تهيئة المستخدمين عند التحميل
if (!localStorage.getItem("users")) {
    clearStorage(); // ينشئ المستخدمين الافتراضيين
}

// تسجيل الدخول
function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    if (!username || !password) { alert("Fill all fields!"); return; }

    const users = JSON.parse(localStorage.getItem("users"));
    if (users.hasOwnProperty(username)) {
        if (users[username].pass === password) {
            localStorage.setItem("currentUser", username);
            if (username === "admin") window.location.href = "admin.html";
            else window.location.href = "user.html";
        } else alert("Password is incorrect!");
    } else alert("Username does not exist!");
}

// تحميل بيانات المستخدم في user.html
if (window.location.pathname.includes("user.html")) {
    const username = localStorage.getItem("currentUser");
    const users = JSON.parse(localStorage.getItem("users"));
    document.getElementById("userName").innerText = username;
    document.getElementById("hours").innerText = users[username].hours.toFixed(2);
    if (users[username].profileImage) document.getElementById("profileImg").src = users[username].profileImage;
}

// رفع صورة
function uploadImage() {
    const file = document.getElementById("uploadImg").files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function() {
        const imgData = reader.result;
        const username = localStorage.getItem("currentUser");
        const users = JSON.parse(localStorage.getItem("users"));
        users[username].profileImage = imgData;
        localStorage.setItem("users", JSON.stringify(users));
        document.getElementById("profileImg").src = imgData;
    };
    reader.readAsDataURL(file);
}

// الحصول على اللوكيشن
function getLocation(callback) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            pos => callback(pos.coords.latitude + ", " + pos.coords.longitude),
            () => callback("Location Denied")
        );
    } else callback("Not Supported");
}

// Check In
function checkIn() {
    const username = localStorage.getItem("currentUser");
    const users = JSON.parse(localStorage.getItem("users"));
    getLocation(location => {
        const now = new Date();
        users[username].lastIn = now;
        users[username].inLocation = location;
        localStorage.setItem("users", JSON.stringify(users));
        document.getElementById("status").innerText = "Checked In at: " + now + "\nLocation: " + location;
    });
}

// Check Out
function checkOut() {
    const username = localStorage.getItem("currentUser");
    const users = JSON.parse(localStorage.getItem("users"));
    getLocation(location => {
        const now = new Date();
        users[username].lastOut = now;
        const diff = (new Date(now) - new Date(users[username].lastIn))/1000/3600;
        users[username].hours += diff;
        localStorage.setItem("users", JSON.stringify(users));
        document.getElementById("hours").innerText = users[username].hours.toFixed(2);
        document.getElementById("status").innerText = "Checked Out at: " + now + "\nLocation: " + location;
    });
}

// لوحة admin
if (window.location.pathname.includes("admin.html")) {
    const users = JSON.parse(localStorage.getItem("users"));
    let table = "";
    for (let u in users) {
        if (u !== "admin") {
            table += `<tr>
                <td>${u}</td>
                <td>${users[u].hours.toFixed(2)}</td>
                <td>${users[u].lastIn} <br><small>${users[u].inLocation}</small></td>
                <td>${users[u].lastOut} <br><small>${users[u].outLocation}</small></td>
            </tr>`;
        }
    }
    document.getElementById("adminTable").innerHTML = table;
}

// إضافة مستخدم جديد
function addUser() {
    const username = document.getElementById("newUser").value.trim();
    const password = document.getElementById("newPass").value.trim();
    if (!username || !password) { alert("Fill all fields!"); return; }

    const users = JSON.parse(localStorage.getItem("users"));
    if (users.hasOwnProperty(username)) { alert("User already exists!"); return; }

    users[username] = { pass: password, hours:0, lastIn:"", lastOut:"", inLocation:"", outLocation:"", profileImage:"" };
    localStorage.setItem("users", JSON.stringify(users));
    alert("User added successfully!");
    document.getElementById("newUser").value = "";
    document.getElementById("newPass").value = "";
}

// Logout
function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
}
