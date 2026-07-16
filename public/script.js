// 1. מאזינים ללחיצה על כפתור השליחה של הטופס
document.getElementById("uploadForm").addEventListener("submit", async (e) => {
  // 2. עוצרים את התנהגות ברירת המחדל של הדפדפן (ריענון הדף)
  e.preventDefault();

  // 3. אורזים את הקובץ והטקסט מתוך הטופס לתוך אובייקט מיוחד
  const formData = new FormData(e.target);

  // 4. שולחים את המידע לשרת (לנתיב /upload) באמצעות בקשת HTTP
  const response = await fetch("/upload", {
    method: "POST",
    body: formData,
  });

  // 5. בודקים מה השרת החזיר לנו
  if (response.ok) {
    alert("הקובץ נשלח לשרת בהצלחה!");
  } else {
    alert("קרתה שגיאה.");
  }
});
